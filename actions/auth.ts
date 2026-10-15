"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { RESERVED_SLUGS } from "@/types/barbershop";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export async function signUp(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/signup?error=1");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed.data);
  if (error) redirect("/signup?error=1");

  if (!data.session) {
    redirect("/signup?check-email=1");
  }

  redirect("/admin");
}

export async function login(formData: FormData) {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/login?error=1");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect("/login?error=1");

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const onboardingSchema = z.object({
  name: z.string().trim().min(2),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/),
  contactEmail: z.string().trim().email(),
});

export async function createBarbershop(formData: FormData) {
  const parsed = onboardingSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    contactEmail: formData.get("contactEmail"),
  });
  if (!parsed.success) redirect("/admin?error=dados-invalidos");

  if (RESERVED_SLUGS.includes(parsed.data.slug)) {
    redirect("/admin?error=slug-reservado");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("barbershops").insert({
    owner_id: user.id,
    slug: parsed.data.slug,
    name: parsed.data.name,
    contact_email: parsed.data.contactEmail,
  });

  if (error) redirect("/admin?error=slug-em-uso");

  redirect("/admin");
}
