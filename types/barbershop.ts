export type Barbershop = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  address: string | null;
  phone: string | null;
  contact_email: string;
  hero_image_url: string | null;
  about_text: string | null;
  about_image_url: string | null;
};

export type Service = {
  id: string;
  barbershop_id: string;
  name: string;
  price: number;
  duration_minutes: number;
  position: number;
};

export const RESERVED_SLUGS = ["admin", "login", "signup", "api"];
