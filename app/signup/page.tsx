import Link from "next/link";
import { signUp } from "@/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; "check-email"?: string }>;
}) {
  const { error, "check-email": checkEmail } = await searchParams;

  if (checkEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-center dark:bg-black">
        <p className="max-w-sm">
          Quase lá! Enviamos um link de confirmação para o seu e-mail. Clique
          nele e depois volte para fazer{" "}
          <Link href="/login" className="underline">
            login
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <form
        action={signUp}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900"
      >
        <h1 className="text-xl font-semibold">Cadastre sua barbearia</h1>
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
          placeholder="Senha (mín. 6 caracteres)"
          required
          minLength={6}
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        />
        {error && (
          <p className="text-sm text-red-600">Não foi possível criar a conta</p>
        )}
        <button
          type="submit"
          className="rounded-full bg-foreground px-5 py-2.5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Criar conta
        </button>
        <p className="text-center text-sm text-zinc-500">
          Já tem conta?{" "}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}
