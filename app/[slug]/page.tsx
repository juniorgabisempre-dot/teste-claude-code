import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookingForm } from "@/components/booking-form";
import { ContactForm } from "@/components/contact-form";
import type { Barbershop, Service } from "@/types/barbershop";

export default async function BarbershopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("barbershops")
    .select("*")
    .eq("slug", slug)
    .single<Barbershop>();

  if (!shop) notFound();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("barbershop_id", shop.id)
    .order("position")
    .returns<Service[]>();

  const heroImage =
    shop.hero_image_url ??
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between px-6 py-5 sm:px-16">
        <span className="text-lg font-semibold">{shop.name}</span>
        <a href="#agendar" className="text-sm font-medium underline">
          Agendar horário
        </a>
      </header>

      <section className="relative flex h-[60vh] min-h-[360px] items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt={shop.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-white">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {shop.name}
          </h1>
          <p className="max-w-md text-lg text-zinc-100">
            {shop.tagline ?? "Agende online em poucos cliques."}
          </p>
          <a
            href="#agendar"
            className="mt-2 rounded-full bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Agendar agora
          </a>
        </div>
      </section>

      <section id="servicos" className="px-6 py-16 sm:px-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">Serviços e preços</h2>
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {services?.length ? (
            services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm dark:bg-zinc-900"
              >
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-zinc-500">{service.duration_minutes} min</p>
                </div>
                <p className="text-lg font-semibold">R$ {service.price}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 sm:col-span-2">
              Nenhum serviço cadastrado ainda.
            </p>
          )}
        </div>
      </section>

      {services?.length ? (
        <section id="agendar" className="px-6 py-16 sm:px-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">Agende seu horário</h2>
          <div className="mx-auto max-w-xl">
            <BookingForm barbershopId={shop.id} services={services} />
          </div>
        </section>
      ) : null}

      {(shop.about_text || shop.about_image_url) && (
        <section id="sobre" className="px-6 py-16 sm:px-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 sm:flex-row">
            {shop.about_image_url && (
              <Image
                src={shop.about_image_url}
                alt={`Interior de ${shop.name}`}
                width={400}
                height={300}
                className="rounded-2xl object-cover"
              />
            )}
            <div>
              <h2 className="mb-3 text-2xl font-semibold">Sobre {shop.name}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{shop.about_text}</p>
            </div>
          </div>
        </section>
      )}

      <section id="contato" className="px-6 py-16 sm:px-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">Fale com a gente</h2>
        <div className="mx-auto max-w-xl">
          <ContactForm barbershopId={shop.id} />
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-zinc-500 sm:px-16">
        {shop.name}
        {shop.address ? ` — ${shop.address}` : ""}
        {shop.phone ? ` — ${shop.phone}` : ""}
      </footer>
    </div>
  );
}
