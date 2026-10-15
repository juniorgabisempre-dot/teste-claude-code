import { Resend } from "resend";

const FROM = "Agenda <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY não configurada — e-mail não enviado.");
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (error) {
    console.error("Falha ao enviar e-mail:", error);
  }
}
