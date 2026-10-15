import { createClient } from "@/lib/supabase/server";
import { createBarbershop, logout } from "@/actions/auth";
import { updateAppointmentStatus } from "@/actions/admin";
import type { Barbershop } from "@/types/barbershop";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Recusado",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: shop } = await supabase
    .from("barbershops")
    .select("*")
    .eq("owner_id", user!.id)
    .maybeSingle<Barbershop>();

  if (!shop) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
        <h1 className="text-xl font-semibold">Cadastre sua barbearia</h1>
        <form action={createBarbershop} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Nome da barbearia"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <input
            name="slug"
            placeholder="endereço (ex: barbearia-uniao)"
            pattern="[a-z0-9-]+"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="E-mail de contato"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
          />
          {error && (
            <p className="text-sm text-red-600">
              Não foi possível salvar — confira os dados (o endereço precisa ser único).
            </p>
          )}
          <button
            type="submit"
            className="rounded-full bg-foreground px-5 py-2.5 text-background"
          >
            Criar
          </button>
        </form>
      </main>
    );
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, service:services(name)")
    .eq("barbershop_id", shop.id)
    .order("scheduled_at", { ascending: true });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{shop.name}</h1>
          <p className="text-sm text-zinc-500">Página: /{shop.slug}</p>
        </div>
        <form action={logout}>
          <button className="text-sm underline">Sair</button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {appointments?.length ? (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  {appt.name} — {appt.service?.name ?? "Serviço removido"}
                </p>
                <p className="text-sm text-zinc-500">
                  {new Date(appt.scheduled_at).toLocaleString("pt-BR")} ·{" "}
                  {appt.phone}
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span className="font-medium">
                    {statusLabel[appt.status] ?? appt.status}
                  </span>
                </p>
              </div>
              {appt.status === "pending" && (
                <div className="flex gap-2">
                  <form
                    action={updateAppointmentStatus.bind(null, appt.id, "confirmed")}
                  >
                    <button className="rounded-full bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700">
                      Aprovar
                    </button>
                  </form>
                  <form
                    action={updateAppointmentStatus.bind(null, appt.id, "cancelled")}
                  >
                    <button className="rounded-full bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700">
                      Recusar
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-zinc-500">Nenhum agendamento ainda.</p>
        )}
      </div>
    </main>
  );
}
