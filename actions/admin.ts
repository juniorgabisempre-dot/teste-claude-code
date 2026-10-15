"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export async function updateAppointmentStatus(
  id: string,
  status: "confirmed" | "cancelled"
) {
  const supabase = await createClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select("name, email, scheduled_at")
    .single();

  revalidatePath("/admin");

  if (!appointment) return;

  const when = new Date(appointment.scheduled_at).toLocaleString("pt-BR");
  const subject =
    status === "confirmed" ? "Agendamento confirmado!" : "Agendamento não confirmado";
  const html =
    status === "confirmed"
      ? `<p>Olá ${appointment.name}, seu horário em ${when} foi confirmado. Te esperamos!</p>`
      : `<p>Olá ${appointment.name}, infelizmente não foi possível confirmar seu horário em ${when}. Entre em contato para reagendar.</p>`;

  await sendEmail({ to: appointment.email, subject, html });
}
