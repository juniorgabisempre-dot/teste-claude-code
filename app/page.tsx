import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Agenda online para a sua barbearia
      </h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Página de agendamento, aprovação de horários e aviso automático pros
        seus clientes — tudo em um só lugar.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Cadastrar minha barbearia
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-black/5 dark:border-zinc-700 dark:hover:bg-white/5"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
