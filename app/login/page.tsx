import Link from "next/link";
import { login } from "@/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <form
        action={login}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
      >
        <h1 className="text-xl font-semibold">Entrar</h1>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        />
        {error && <p className="text-sm text-red-600">E-mail ou senha incorretos</p>}
        <button
          type="submit"
          className="rounded-full bg-foreground px-5 py-2.5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Entrar
        </button>
        <p className="text-center text-sm text-zinc-500">
          Ainda não tem conta?{" "}
          <Link href="/signup" className="underline">
            Cadastre sua barbearia
          </Link>
        </p>
      </form>
    </main>
  );
}
