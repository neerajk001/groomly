import { seedDB } from "./seed";
import type {
  Booking,
  BookingDraft,
  Customer,
  DB,
  PaymentMethod,
  Service,
  Settings,
  Stylist,
} from "./types";
import { uid } from "./utils";

const STORAGE_KEY = "groomly.db.v3";

const serverState: DB = seedDB();
let state: DB = serverState;
let hydrated = false;
let storageBound = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable */
  }
}

function commit(next: DB, shouldPersist = true) {
  state = next;
  if (shouldPersist) persist();
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): DB {
  return state;
}

export function getServerSnapshot(): DB {
  return serverState;
}

export function getHydrated(): boolean {
  return hydrated;
}

export function getServerHydrated(): boolean {
  return false;
}

export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DB>;
      state = { ...serverState, ...parsed };
    } else {
      persist();
    }
  } catch {
    /* ignore malformed storage */
  }

  emit();

  if (!storageBound) {
    storageBound = true;
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        state = { ...serverState, ...(JSON.parse(event.newValue) as Partial<DB>) };
        emit();
      } catch {
        /* ignore */
      }
    });
  }
}

export function resetDemo() {
  commit(seedDB());
}

export function setDraft(draft: BookingDraft | null) {
  commit({ ...state, draft });
}

export function updateDraft(patch: Partial<BookingDraft>) {
  if (!state.draft) return;
  commit({ ...state, draft: { ...state.draft, ...patch } });
}

export function toggleFavorite(salonId: string) {
  const favorites = state.favorites.includes(salonId)
    ? state.favorites.filter((id) => id !== salonId)
    : [...state.favorites, salonId];
  commit({ ...state, favorites });
}

export function createBooking(input: {
  service: Service;
  stylist: Stylist;
  salonId: string;
  salonName: string;
  date: string;
  time: string;
  payment: PaymentMethod;
  discount: number;
  customerId?: string;
  customerName?: string;
}): Booking {
  const booking: Booking = {
    id: uid("bk"),
    code: `GRM${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: input.customerId ?? "cus_neeraj",
    customerName: input.customerName ?? state.user.name,
    serviceId: input.service.id,
    serviceName: input.service.name,
    stylistId: input.stylist.id,
    stylistName: input.stylist.name,
    salonId: input.salonId,
    salonName: input.salonName,
    date: input.date,
    time: input.time,
    duration: input.service.duration,
    price: input.service.price - input.discount,
    platformFee: 20,
    status: "Confirmed",
    payment: input.payment,
    createdAt: new Date().toISOString(),
  };

  const customerExists = state.customers.some(
    (c) => c.id === booking.customerId,
  );
  const customers = customerExists
    ? state.customers.map((c) =>
        c.id === booking.customerId ? { ...c, visits: c.visits + 1 } : c,
      )
    : [
        ...state.customers,
        {
          id: booking.customerId,
          name: booking.customerName,
          email: state.user.email,
          phone: state.user.phone,
          avatar: state.user.avatar,
          category: "New" as const,
          visits: 1,
          joinedAt: new Date().toISOString().slice(0, 10),
        },
      ];

  commit({
    ...state,
    bookings: [booking, ...state.bookings],
    customers,
    draft: null,
  });

  return booking;
}

export function updateBookingStatus(id: string, status: Booking["status"]) {
  commit({
    ...state,
    bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
  });
}

export function deleteBooking(id: string) {
  commit({ ...state, bookings: state.bookings.filter((b) => b.id !== id) });
}

export function upsertService(service: Service) {
  const exists = state.services.some((s) => s.id === service.id);
  commit({
    ...state,
    services: exists
      ? state.services.map((s) => (s.id === service.id ? service : s))
      : [service, ...state.services],
  });
}

export function deleteService(id: string) {
  commit({ ...state, services: state.services.filter((s) => s.id !== id) });
}

export function upsertStylist(stylist: Stylist) {
  const exists = state.stylists.some((s) => s.id === stylist.id);
  commit({
    ...state,
    stylists: exists
      ? state.stylists.map((s) => (s.id === stylist.id ? stylist : s))
      : [stylist, ...state.stylists],
  });
}

export function deleteStylist(id: string) {
  commit({ ...state, stylists: state.stylists.filter((s) => s.id !== id) });
}

export function upsertCustomer(customer: Customer) {
  const exists = state.customers.some((c) => c.id === customer.id);
  commit({
    ...state,
    customers: exists
      ? state.customers.map((c) => (c.id === customer.id ? customer : c))
      : [customer, ...state.customers],
  });
}

export function deleteCustomer(id: string) {
  commit({ ...state, customers: state.customers.filter((c) => c.id !== id) });
}

export function updateSettings(settings: Settings) {
  commit({ ...state, settings });
}

export function updateUser(patch: Partial<DB["user"]>) {
  commit({ ...state, user: { ...state.user, ...patch } });
}
