"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAppointment } from "@/actions/booking";
import { appointmentSchema, type AppointmentInput } from "@/types/booking";
import { timeSlots } from "@/lib/services";
import type { Service } from "@/types/barbershop";

export function BookingForm({
  barbershopId,
  services,
}: {
  barbershopId: string;
  services: Service[];
}) {
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { barbershopId },
  });

  const onSubmit = async (data: AppointmentInput) => {
    const outcome = await createAppointment(data);
    setResult(outcome);
    if (outcome.success) {
      reset({ barbershopId });
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Nome
          <input
            {...register("name")}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {errors.name && (
            <span className="text-xs text-red-600">{errors.name.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Telefone
          <input
            {...register("phone")}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {errors.phone && (
            <span className="text-xs text-red-600">{errors.phone.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          E-mail
          <input
            type="email"
            {...register("email")}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {errors.email && (
            <span className="text-xs text-red-600">{errors.email.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Serviço
          <select
            {...register("serviceId")}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — R$ {service.price}
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <span className="text-xs text-red-600">{errors.serviceId.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Data
          <input
            type="date"
            min={today}
            {...register("date")}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {errors.date && (
            <span className="text-xs text-red-600">{errors.date.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Horário
          <select
            {...register("time")}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <span className="text-xs text-red-600">{errors.time.message}</span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-foreground px-5 py-2.5 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {isSubmitting ? "Enviando..." : "Solicitar agendamento"}
      </button>

      {result?.success && (
        <p className="text-sm text-green-600">
          Solicitação enviada! Vamos confirmar seu horário em breve.
        </p>
      )}
      {result?.success === false && (
        <p className="text-sm text-red-600">{result.error}</p>
      )}
    </form>
  );
}
