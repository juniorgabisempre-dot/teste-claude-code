-- Rodar manualmente no SQL Editor do Supabase. Sem CLI configurado neste projeto.

create table barbershops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text unique not null,
  name text not null,
  tagline text,
  address text,
  phone text,
  contact_email text not null,
  hero_image_url text,
  about_text text,
  about_image_url text,
  created_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null,
  duration_minutes int not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  service_id uuid not null references services(id),
  name text not null,
  phone text not null,
  email text not null,
  scheduled_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Trava o horário a nível de banco: duas pessoas não conseguem reservar o
-- mesmo slot na mesma barbearia, mesmo em caso de corrida entre requests.
create unique index appointments_slot_unique
  on appointments (barbershop_id, scheduled_at)
  where status in ('pending', 'confirmed');

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table barbershops enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;
alter table contact_messages enable row level security;

-- Leitura pública: necessária pra renderizar a página /[slug] de cada barbearia
create policy "public read shops" on barbershops for select to anon, authenticated using (true);
create policy "public read services" on services for select to anon, authenticated using (true);

-- Dono cria/edita só a própria barbearia (criada no signup, owner_id = auth.uid())
create policy "owner creates shop" on barbershops for insert to authenticated
  with check (owner_id = auth.uid());
create policy "owner updates shop" on barbershops for update to authenticated
  using (owner_id = auth.uid());

-- Dono gerencia os próprios serviços
create policy "owner manages services" on services for all to authenticated
  using (barbershop_id in (select id from barbershops where owner_id = auth.uid()))
  with check (barbershop_id in (select id from barbershops where owner_id = auth.uid()));

-- Cliente final (sem conta) pode criar agendamento/mensagem, mas não ler nem alterar
create policy "public insert appointments" on appointments for insert to anon, authenticated with check (true);
create policy "public insert messages" on contact_messages for insert to anon, authenticated with check (true);

-- Só o dono vê/aprova os agendamentos e mensagens da própria barbearia
create policy "owner reads appointments" on appointments for select to authenticated
  using (barbershop_id in (select id from barbershops where owner_id = auth.uid()));
create policy "owner updates appointments" on appointments for update to authenticated
  using (barbershop_id in (select id from barbershops where owner_id = auth.uid()));
create policy "owner reads messages" on contact_messages for select to authenticated
  using (barbershop_id in (select id from barbershops where owner_id = auth.uid()));
