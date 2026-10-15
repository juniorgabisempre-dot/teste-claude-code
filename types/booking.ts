import { z } from "zod";
import { timeSlots } from "@/lib/services";

export const appointmentSchema = z.object({
  barbershopId: z.string().uuid(),
  serviceId: z.string().uuid({ error: "Escolha um serviço" }),
  name: z.string().trim().min(2, "Informe seu nome"),
  phone: z.string().trim().min(8, "Informe um telefone válido"),
  email: z.string().trim().email("Informe um e-mail válido"),
  date: z.string().min(1, "Escolha uma data"),
  time: z.enum(timeSlots as [string, ...string[]], {
    error: "Escolha um horário",
  }),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

export const contactSchema = z.object({
  barbershopId: z.string().uuid(),
  name: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().email("Informe um e-mail válido"),
  message: z.string().trim().min(10, "Escreva uma mensagem um pouco maior"),
});

export type ContactInput = z.infer<typeof contactSchema>;
