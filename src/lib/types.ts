export type ServiceStatus = "Active" | "Inactive";

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image: string;
  status: ServiceStatus;
  popular?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  rating: number;
  bookings: number;
  avatar: string;
  status: ServiceStatus;
  specialties: string[];
}

export interface Salon {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  area: string;
  city: string;
  distanceKm: number;
  image: string;
  gallery: string[];
  tags: string[];
  serviceIds: string[];
  stylistIds: string[];
  openTime: string;
  closeTime: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  category: "New" | "Regular" | "VIP";
  visits: number;
  joinedAt: string;
}

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type PaymentMethod = "UPI" | "Card" | "Pay at Salon";

export interface Booking {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  salonId: string;
  salonName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  platformFee: number;
  status: BookingStatus;
  payment: PaymentMethod;
  createdAt: string;
}

export interface BookingDraft {
  salonId: string;
  serviceId: string;
  stylistId: string | null;
  date: string;
  time: string;
  coupon?: string;
  discount?: number;
  payment?: PaymentMethod;
}

export interface Settings {
  salonName: string;
  email: string;
  phone: string;
  address: string;
  openTime: string;
  closeTime: string;
  currency: string;
  bookingRules: {
    slotDuration: number;
    advanceDays: number;
    allowCancellation: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
}

export interface DB {
  services: Service[];
  stylists: Stylist[];
  salons: Salon[];
  customers: Customer[];
  bookings: Booking[];
  settings: Settings;
  user: UserProfile;
  draft: BookingDraft | null;
  favorites: string[];
}
