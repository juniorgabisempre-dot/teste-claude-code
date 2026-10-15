"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { appointmentSchema, type AppointmentInput } from "@/types/booking";

const UNIQUE_VIOLATION = "23505";

export async function createAppointment(input: AppointmentInput) {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Dados inválidos" };
  }

  const { barbershopId, serviceId, name, phone, email, date, time } =
    parsed.data;
  const scheduledAt = new Date(`${date}T${time}:00`);

  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    barbershop_id: barbershopId,
    service_id: serviceId,
    name,
    phone,
    email,
    scheduled_at: scheduledAt.toISOString(),
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return {
        success: false as const,
        error: "Esse horário acabou de ser reservado por outra pessoa. Escolha outro horário.",
      };
    }
    return { success: false as const, error: "Não foi possível agendar. Tente novamente." };
  }

  const { data: shop } = await supabase
    .from("barbershops")
    .select("name, contact_email")
    .eq("id", barbershopId)
    .single();

  if (shop) {
    await sendEmail({
      to: shop.contact_email,
      subject: `Nova solicitação de agendamento — ${name}`,
      html: `<p><strong>${name}</strong> solicitou um horário em ${scheduledAt.toLocaleString("pt-BR")}.</p><p>Telefone: ${phone}</p><p>Acesse o painel para aprovar ou recusar.</p>`,
    });
  }

  return { success: true as const };
}
