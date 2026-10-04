import type {
  Booking,
  BookingStatus,
  Customer,
  DB,
  PaymentMethod,
  Salon,
  Service,
  Settings,
  Stylist,
  UserProfile,
} from "./types";
import { addDays, todayISO } from "./utils";

const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const IMG = {
  onboarding: unsplash("photo-1585747860715-2ba37e788b70", 900, 1600),
  promo: unsplash("photo-1503951914875-452162b0f3f1", 900, 700),
  barberClub: unsplash("photo-1622286342621-4bd786c2447c", 1000, 700),
  salonInterior: unsplash("photo-1560066984-138dadb4c035", 1000, 700),
  salonLuxe: unsplash("photo-1599351431202-1e0f0137899a", 1000, 700),
  salon4: unsplash("photo-1600948836101-f9ffda59d250", 1000, 700),
  salon5: unsplash("photo-1521490878406-4947b7e2f7f6", 1000, 700),
  salon6: unsplash("photo-1517832606299-7ae9b720a186", 1000, 700),
  haircut: unsplash("photo-1580618672591-eb180b1a973f", 500, 500),
  skinFade: unsplash("photo-1519699047748-de8e457a634e", 500, 500),
  beard: unsplash("photo-1621605815971-fbc98d665033", 500, 500),
  facial: unsplash("photo-1570172619644-dfd03ed5d881", 500, 500),
  hairColor: unsplash("photo-1567894340315-735d7c361db0", 500, 500),
  spa: unsplash("photo-1540555700478-4be289fbecef", 500, 500),
  massage: unsplash("photo-1596704017254-9b121068fb31", 500, 500),
  other: unsplash("photo-1521590832167-7bcbfaa6381f", 500, 500),
  stylist1: unsplash("photo-1618077360395-f3068be8e001", 300, 300),
  stylist2: unsplash("photo-1506794778202-cad84cf45f1d", 300, 300),
  stylist3: unsplash("photo-1500648767791-00dcc994a43e", 300, 300),
  stylist4: unsplash("photo-1600486913747-55e5470d6f40", 300, 300),
};

const avatar = (img: number) => `https://i.pravatar.cc/200?img=${img}`;

const services: Service[] = [
  {
    id: "svc_haircut",
    name: "Classic Haircut",
    category: "Haircut",
    price: 399,
    duration: 30,
    description:
      "A precision cut tailored to your face shape, finished with a hot towel and styling.",
    image: IMG.haircut,
    status: "Active",
    popular: true,
  },
  {
    id: "svc_skin_fade",
    name: "Skin Fade",
    category: "Haircut",
    price: 499,
    duration: 45,
    description:
      "Sharp, seamless gradient fade using clippers and razor detailing for a clean finish.",
    image: IMG.skinFade,
    status: "Active",
    popular: true,
  },
  {
    id: "svc_kids",
    name: "Kids Haircut",
    category: "Haircut",
    price: 299,
    duration: 30,
    description:
      "A fun, gentle cut for the little ones with patient, kid-friendly stylists.",
    image: IMG.other,
    status: "Active",
  },
  {
    id: "svc_beard",
    name: "Beard Trim",
    category: "Beard",
    price: 299,
    duration: 30,
    description:
      "Sculpt, line-up and condition your beard for a crisp, groomed look.",
    image: IMG.beard,
    status: "Active",
    popular: true,
  },
  {
    id: "svc_beard_sculpt",
    name: "Beard Sculpt & Spa",
    category: "Beard",
    price: 549,
    duration: 45,
    description:
      "Full beard sculpt with hot towel, oils and a relaxing beard spa finish.",
    image: IMG.beard,
    status: "Active",
  },
  {
    id: "svc_facial",
    name: "Facial",
    category: "Facial",
    price: 699,
    duration: 60,
    description:
      "Deep-cleansing facial with steam, exfoliation and a hydrating mask for glowing skin.",
    image: IMG.facial,
    status: "Active",
  },
  {
    id: "svc_haircolor",
    name: "Hair Color",
    category: "Coloring",
    price: 1299,
    duration: 90,
    description:
      "Full colour service with premium ammonia-free products and a glossy finishing treatment.",
    image: IMG.hairColor,
    status: "Active",
  },
  {
    id: "svc_spa",
    name: "Head Massage",
    category: "Spa",
    price: 599,
    duration: 45,
    description:
      "Relaxing scalp and shoulder massage with warm oils to melt the stress away.",
    image: IMG.spa,
    status: "Active",
  },
  {
    id: "svc_massage",
    name: "Body Massage",
    category: "Spa",
    price: 1499,
    duration: 60,
    description:
      "A full-body relaxation massage to relieve tension and restore energy.",
    image: IMG.massage,
    status: "Active",
  },
];

const stylists: Stylist[] = [
  {
    id: "sty_aman",
    name: "Aman",
    role: "Hair Stylist",
    rating: 4.8,
    bookings: 120,
    avatar: IMG.stylist1,
    status: "Active",
    specialties: ["Haircut", "Beard"],
  },
  {
    id: "sty_vivek",
    name: "Vivek",
    role: "Hair Stylist",
    rating: 4.7,
    bookings: 98,
    avatar: IMG.stylist2,
    status: "Active",
    specialties: ["Haircut", "Coloring"],
  },
  {
    id: "sty_raj",
    name: "Raj",
    role: "Hair Stylist",
    rating: 4.6,
    bookings: 76,
    avatar: IMG.stylist3,
    status: "Active",
    specialties: ["Beard", "Facial"],
  },
  {
    id: "sty_sameer",
    name: "Sameer",
    role: "Senior Stylist",
    rating: 4.5,
    bookings: 64,
    avatar: IMG.stylist4,
    status: "Active",
    specialties: ["Spa", "Facial"],
  },
];

const salons: Salon[] = [
  {
    id: "sal_groomly",
    name: "Groomly",
    rating: 4.8,
    reviews: 1280,
    address: "123 Linking Road, Andheri West, Mumbai",
    area: "Andheri West",
    city: "Mumbai",
    distanceKm: 0,
    image: IMG.barberClub,
    gallery: [
      IMG.barberClub,
      IMG.salonInterior,
      IMG.haircut,
      IMG.beard,
      IMG.facial,
      IMG.spa,
    ],
    tags: ["Hygienic", "Professional", "Top Rated"],
    serviceIds: services.map((s) => s.id),
    stylistIds: stylists.map((s) => s.id),
    openTime: "9:00 AM",
    closeTime: "9:00 PM",
  },
];

const customers: Customer[] = [
  {
    id: "cus_neeraj",
    name: "Neeraj Kushwaha",
    email: "neeraj@email.com",
    phone: "+91 9876543210",
    avatar: avatar(12),
    category: "Regular",
    visits: 6,
    joinedAt: addDays(todayISO(), -58),
  },
  {
    id: "cus_rohan",
    name: "Rohan Mehta",
    email: "rohan@email.com",
    phone: "+91 9876543211",
    avatar: avatar(33),
    category: "Regular",
    visits: 9,
    joinedAt: addDays(todayISO(), -44),
  },
  {
    id: "cus_aditya",
    name: "Aditya Singh",
    email: "aditya@email.com",
    phone: "+91 9876543212",
    avatar: avatar(52),
    category: "New",
    visits: 2,
    joinedAt: addDays(todayISO(), -12),
  },
  {
    id: "cus_kunal",
    name: "Kunal Sharma",
    email: "kunal@email.com",
    phone: "+91 9876543213",
    avatar: avatar(60),
    category: "VIP",
    visits: 14,
    joinedAt: addDays(todayISO(), -120),
  },
  {
    id: "cus_vikram",
    name: "Vikram Patel",
    email: "vikram@email.com",
    phone: "+91 9876543214",
    avatar: avatar(15),
    category: "New",
    visits: 1,
    joinedAt: addDays(todayISO(), -6),
  },
  {
    id: "cus_aarav",
    name: "Aarav Sharma",
    email: "aarav@email.com",
    phone: "+91 9876543215",
    avatar: avatar(11),
    category: "Regular",
    visits: 5,
    joinedAt: addDays(todayISO(), -33),
  },
  {
    id: "cus_dev",
    name: "Dev Patel",
    email: "dev@email.com",
    phone: "+91 9876543216",
    avatar: avatar(14),
    category: "New",
    visits: 2,
    joinedAt: addDays(todayISO(), -9),
  },
  {
    id: "cus_karan",
    name: "Karan Malhotra",
    email: "karan@email.com",
    phone: "+91 9876543217",
    avatar: avatar(8),
    category: "VIP",
    visits: 18,
    joinedAt: addDays(todayISO(), -160),
  },
  {
    id: "cus_rahul",
    name: "Rahul Verma",
    email: "rahul@email.com",
    phone: "+91 9876543218",
    avatar: avatar(18),
    category: "Regular",
    visits: 7,
    joinedAt: addDays(todayISO(), -70),
  },
  {
    id: "cus_ishaan",
    name: "Ishaan Gupta",
    email: "ishaan@email.com",
    phone: "+91 9876543219",
    avatar: avatar(23),
    category: "New",
    visits: 1,
    joinedAt: addDays(todayISO(), -3),
  },
  {
    id: "cus_arjun",
    name: "Arjun Nair",
    email: "arjun@email.com",
    phone: "+91 9876543220",
    avatar: avatar(36),
    category: "Regular",
    visits: 4,
    joinedAt: addDays(todayISO(), -25),
  },
  {
    id: "cus_siddh",
    name: "Siddharth Rao",
    email: "siddharth@email.com",
    phone: "+91 9876543221",
    avatar: avatar(41),
    category: "VIP",
    visits: 11,
    joinedAt: addDays(todayISO(), -95),
  },
];

const settings: Settings = {
  salonName: "Groomly",
  email: "hello@thebarberclub.in",
  phone: "+91 9876543210",
  address: "123 Linking Road, Andheri West, Mumbai",
  openTime: "9:00 AM",
  closeTime: "9:00 PM",
  currency: "₹",
  bookingRules: {
    slotDuration: 30,
    advanceDays: 14,
    allowCancellation: true,
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
};

const user: UserProfile = {
  name: "Neeraj",
  email: "neeraj@email.com",
  phone: "+91 9876543210",
  city: "Mumbai, Maharashtra",
  avatar: avatar(12),
};

/* --------------------------- deterministic generator -------------------------- */

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fmtTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${String(minute).padStart(2, "0")} ${period}`;
}

function buildBookings(
  allServices: Service[],
  allStylists: Stylist[],
  allCustomers: Customer[],
): Booking[] {
  const rand = mulberry32(987654321);
  const today = todayISO();
  const bookings: Booking[] = [];
  const used = new Set<string>();
  let code = 1000;

  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const pickInt = (min: number, max: number) =>
    min + Math.floor(rand() * (max - min + 1));

  const slots: string[] = [];
  for (let h = 9; h < 21; h++) {
    for (const m of [0, 30]) slots.push(fmtTime(h, m));
  }

  const make = (
    date: string,
    time: string,
    customer: Customer,
    service: Service,
    stylist: Stylist,
    status: BookingStatus,
    payment: PaymentMethod,
  ): Booking => {
    code += 1;
    return {
      id: `bk_${code}`,
      code: `GRM${code}`,
      customerId: customer.id,
      customerName: customer.name,
      serviceId: service.id,
      serviceName: service.name,
      stylistId: stylist.id,
      stylistName: stylist.name,
      salonId: "sal_groomly",
      salonName: "Groomly",
      date,
      time,
      duration: service.duration,
      price: service.price,
      platformFee: 20,
      status,
      payment,
      createdAt: date,
    };
  };

  const byName = (name: string) =>
    allCustomers.find((c) => c.name === name) ?? allCustomers[0];

  // Featured "today" appointments so the dashboard looks curated.
  const featured: [string, string, string, string, BookingStatus, PaymentMethod][] =
    [
      ["10:00 AM", "Rohan Mehta", "svc_haircut", "sty_aman", "Completed", "UPI"],
      ["11:00 AM", "Kunal Sharma", "svc_beard", "sty_vivek", "In Progress", "Card"],
      ["1:00 PM", "Aditya Singh", "svc_haircut", "sty_raj", "Confirmed", "UPI"],
      ["2:00 PM", "Neeraj Kushwaha", "svc_haircut", "sty_aman", "Confirmed", "Pay at Salon"],
      ["4:00 PM", "Vikram Patel", "svc_facial", "sty_sameer", "Pending", "Pay at Salon"],
    ];
  for (const [time, name, serviceId, stylistId, status, payment] of featured) {
    const stylist = allStylists.find((s) => s.id === stylistId)!;
    const service = allServices.find((s) => s.id === serviceId)!;
    used.add(`${stylistId}|${today}|${time}`);
    bookings.push(make(today, time, byName(name), service, stylist, status, payment));
  }

  // A couple more for today to fill the schedule.
  for (const [time, name, serviceId, stylistId] of [
    ["12:00 PM", "Aarav Sharma", "svc_skin_fade", "sty_aman"],
    ["3:00 PM", "Karan Malhotra", "svc_haircolor", "sty_vivek"],
    ["5:00 PM", "Rahul Verma", "svc_spa", "sty_raj"],
    ["6:00 PM", "Dev Patel", "svc_beard_sculpt", "sty_sameer"],
  ] as const) {
    const key = `${stylistId}|${today}|${time}`;
    if (used.has(key)) continue;
    used.add(key);
    const stylist = allStylists.find((s) => s.id === stylistId)!;
    const service = allServices.find((s) => s.id === serviceId)!;
    bookings.push(
      make(today, time, byName(name), service, stylist, "Confirmed", "UPI"),
    );
  }

  // Historical + upcoming bookings over a rolling window.
  for (let offset = -45; offset <= 14; offset++) {
    const date = addDays(today, offset);
    const dow = new Date(date + "T00:00:00").getDay();
    let count = pickInt(5, 10);
    if (dow === 0) count = pickInt(3, 6);
    if (dow === 6) count = pickInt(7, 12);
    if (offset === 0) count = 3;

    for (let i = 0; i < count; i++) {
      const stylist = pick(allStylists);
      const time = pick(slots);
      const key = `${stylist.id}|${date}|${time}`;
      if (used.has(key)) continue;
      used.add(key);

      const service = pick(allServices);
      const customer = rand() < 0.18 ? byName("Neeraj Kushwaha") : pick(allCustomers);

      let status: BookingStatus;
      if (offset < 0) status = rand() < 0.88 ? "Completed" : "Cancelled";
      else if (offset === 0)
        status = rand() < 0.6 ? "Completed" : "Confirmed";
      else status = rand() < 0.72 ? "Confirmed" : "Pending";

      const payment: PaymentMethod =
        rand() < 0.5 ? "UPI" : rand() < 0.6 ? "Card" : "Pay at Salon";

      bookings.push(make(date, time, customer, service, stylist, status, payment));
    }
  }

  return bookings.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function seedDB(): DB {
  return {
    services,
    stylists,
    salons,
    customers,
    bookings: buildBookings(services, stylists, customers),
    settings,
    user,
    draft: null,
    favorites: [],
  };
}
