"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendContactMessage } from "@/actions/contact";
import { contactSchema, type ContactInput } from "@/types/booking";

export function ContactForm({ barbershopId }: { barbershopId: string }) {
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { barbershopId },
  });

  const onSubmit = async (data: ContactInput) => {
    const outcome = await sendContactMessage(data);
    setResult(outcome);
    if (outcome.success) {
      reset({ barbershopId });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
    >
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
        Mensagem
        <textarea
          {...register("message")}
          rows={4}
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        />
        {errors.message && (
          <span className="text-xs text-red-600">{errors.message.message}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-foreground px-5 py-2.5 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </button>

      {result?.success && (
        <p className="text-sm text-green-600">Mensagem enviada! Responderemos em breve.</p>
      )}
      {result?.success === false && (
        <p className="text-sm text-red-600">{result.error}</p>
      )}
    </form>
  );
}
