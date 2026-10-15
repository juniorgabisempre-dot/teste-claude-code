"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema, type ContactInput } from "@/types/booking";

export async function sendContactMessage(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Dados inválidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    barbershop_id: parsed.data.barbershopId,
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return { success: false as const, error: "Não foi possível enviar. Tente novamente." };
  }

  return { success: true as const };
}
