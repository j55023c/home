-- ============================================================
-- SUPABASE SETUP — Home Negócios Imobiliários
-- Execute no SQL Editor do painel Supabase (project → SQL Editor → New query)
-- ============================================================

-- 1. EXTENSÕES
create extension if not exists "uuid-ossp";

-- 2. TABELA: corretoras
create table if not exists public.corretoras (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nome text not null,
  creci text not null unique,
  telefone text,
  email text,
  foto text, -- URL da foto padronizada (ex: /images/team/liliane.png)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. TABELA: imoveis
create table if not exists public.imoveis (
  id uuid primary key default uuid_generate_v4(),
  corretora_id uuid not null references public.corretoras(id) on delete cascade,
  titulo text not null,
  tipo text not null check (tipo in ('casa','apartamento','cobertura','terreno','comercial')),
  finalidade text not null check (finalidade in ('venda','aluguel')),
  preco numeric(14,2),
  endereco text, -- USO INTERNO: nunca exibido no site público
  bairro text,
  cidade text default 'Três Lagoas',
  quartos int,
  banheiros int,
  vagas int,
  area_m2 numeric(10,2),
  area_util numeric(10,2),
  suites int,
  ano_construcao int,
  iptu numeric(14,2),
  condominio numeric(14,2),
  taxas numeric(14,2),
  caracteristicas text[] default '{}',
  descricao text,
  destaque boolean default false,
  status text not null default 'disponivel' check (status in ('disponivel','reservado','vendido')),
  publicado boolean default false,
  referencia text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. TABELA: imovel_fotos
create table if not exists public.imovel_fotos (
  id uuid primary key default uuid_generate_v4(),
  imovel_id uuid not null references public.imoveis(id) on delete cascade,
  url text not null,
  ordem int default 0,
  created_at timestamptz default now()
);

-- 5. TABELA: leads (criada automaticamente pelo site, mas aqui pra referência)
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text not null,
  telefone text,
  mensagem text,
  imovel_id uuid references public.imoveis(id) on delete set null,
  created_at timestamptz default now()
);

-- 6. ÍNDICES DE PERFORMANCE
create index if not exists idx_imoveis_publicado_created on public.imoveis (publicado, created_at desc);
create index if not exists idx_imoveis_corretora on public.imoveis (corretora_id);
create index if not exists idx_imoveis_destaque_publicado on public.imoveis (destaque, publicado, created_at desc);
create index if not exists idx_imoveis_finalidade_tipo on public.imoveis (finalidade, tipo);
create index if not exists idx_imoveis_cidade on public.imoveis (cidade);
create index if not exists idx_imoveis_bairro on public.imoveis (bairro);
create index if not exists idx_imovel_fotos_imovel on public.imovel_fotos (imovel_id, ordem);
create index if not exists idx_leads_imovel on public.leads (imovel_id);
create index if not exists idx_leads_created on public.leads (created_at desc);

-- 7. ROW LEVEL SECURITY (RLS)
alter table public.corretoras enable row level security;
alter table public.imoveis enable row level security;
alter table public.imovel_fotos enable row level security;
alter table public.leads enable row level security;

-- 8. POLICIES: corretoras
-- Corretora vê só o próprio registro
drop policy if exists "corretora_select_own" on public.corretoras;
create policy "corretora_select_own"
  on public.corretoras for select
  using (user_id = auth.uid());

-- Admin (service role) pode inserir/atualizar corretoras
drop policy if exists "admin_all_corretoras" on public.corretoras;
create policy "admin_all_corretoras"
  on public.corretoras for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 9. POLICIES: imoveis
-- Público: SELECT só publicados
drop policy if exists "public_select_published" on public.imoveis;
create policy "public_select_published"
  on public.imoveis for select
  using (publicado = true);

-- Corretora: CRUD só nos próprios imóveis
drop policy if exists "corretora_crud_own" on public.imoveis;
create policy "corretora_crud_own"
  on public.imoveis for all
  using (corretora_id in (select id from public.corretoras where user_id = auth.uid()))
  with check (corretora_id in (select id from public.corretoras where user_id = auth.uid()));

-- Admin: tudo
drop policy if exists "admin_all_imoveis" on public.imoveis;
create policy "admin_all_imoveis"
  on public.imoveis for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 10. POLICIES: imovel_fotos
-- Público: SELECT se imóvel publicado
drop policy if exists "public_select_fotos_published" on public.imovel_fotos;
create policy "public_select_fotos_published"
  on public.imovel_fotos for select
  using (
    imovel_id in (select id from public.imoveis where publicado = true)
  );

-- Corretora: INSERT/DELETE só nos próprios imóveis
drop policy if exists "corretora_manage_own_fotos" on public.imovel_fotos;
create policy "corretora_manage_own_fotos"
  on public.imovel_fotos for all
  using (
    imovel_id in (
      select i.id from public.imoveis i
      join public.corretoras c on c.id = i.corretora_id
      where c.user_id = auth.uid()
    )
  )
  with check (
    imovel_id in (
      select i.id from public.imoveis i
      join public.corretoras c on c.id = i.corretora_id
      where c.user_id = auth.uid()
    )
  );

-- Admin: tudo
drop policy if exists "admin_all_fotos" on public.imovel_fotos;
create policy "admin_all_fotos"
  on public.imovel_fotos for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 11. POLICIES: leads
-- Público: INSERT (formulário do site)
drop policy if exists "public_insert_leads" on public.leads;
create policy "public_insert_leads"
  on public.leads for insert
  with check (true);

-- Corretora: SELECT leads dos próprios imóveis
drop policy if exists "corretora_select_own_leads" on public.leads;
create policy "corretora_select_own_leads"
  on public.leads for select
  using (
    imovel_id is null
    or imovel_id in (
      select i.id from public.imoveis i
      join public.corretoras c on c.id = i.corretora_id
      where c.user_id = auth.uid()
    )
  );

-- Admin: tudo
drop policy if exists "admin_all_leads" on public.leads;
create policy "admin_all_leads"
  on public.leads for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 12. TRIGGER: updated_at automático
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trigger_corretoras_updated on public.corretoras;
create trigger trigger_corretoras_updated
  before update on public.corretoras
  for each row execute function public.handle_updated_at();

drop trigger if exists trigger_imoveis_updated on public.imoveis;
create trigger trigger_imoveis_updated
  before update on public.imoveis
  for each row execute function public.handle_updated_at();

-- 13. SEED: 3 Corretoras (rode APÓS criar os usuários no Authentication → Users)
-- Substitua os UUIDs abaixo pelos user_id reais criados no Auth
-- Exemplo:
-- insert into public.corretoras (user_id, nome, creci, telefone, email, foto)
-- values
--   ('UUID_DA_LILIANE', 'Liliane de Lima Teixeira', '9821', '(67) 99999-0001', 'liliane@homeimobiliaria.com', '/images/team/liliane.png'),
--   ('UUID_DA_MARILZA', 'Marilza Galante', '6618', '(67) 99999-0002', 'marilza@homeimobiliaria.com', '/images/team/marilza.png'),
--   ('UUID_DA_SILVANA', 'Silvana Garcia', '8889', '(67) 99999-0003', 'silvana@homeimobiliaria.com', '/images/team/silvana.png');

-- 14. SEED: Imóveis de exemplo (rode após inserir corretoras e pegar os IDs)
-- Substitua CORRETORA_ID_1, CORRETORA_ID_2, CORRETORA_ID_3 pelos IDs reais da tabela corretoras
-- insert into public.imoveis (corretora_id, titulo, tipo, finalidade, preco, bairro, cidade, quartos, banheiros, vagas, area_m2, descricao, destaque, publicado, referencia)
-- values
--   (CORRETORA_ID_1, 'Casa 3 quartos no Jardim Alvorada', 'casa', 'venda', 450000, 'Jardim Alvorada', 'Três Lagoas', 3, 2, 2, 120, 'Casa ampla com quintal, perto de escolas e comércio.', true, true, 'HL001'),
--   (CORRETORA_ID_2, 'Apartamento 2 quartos no Centro', 'apartamento', 'venda', 320000, 'Centro', 'Três Lagoas', 2, 1, 1, 75, 'Apartamento reformado, andar alto, vista livre.', true, true, 'HL002'),
--   (CORRETORA_ID_3, 'Terreno 360m² no Vila Nova', 'terreno', 'venda', 180000, 'Vila Nova', 'Três Lagoas', null, null, null, 360, 'Terreno plano, documentação em dia.', false, true, 'HL003'),
--   (CORRETORA_ID_1, 'Cobertura duplex 4 suítes', 'cobertura', 'venda', 850000, 'Jardim dos Ipês', 'Três Lagoas', 4, 4, 3, 280, 'Cobertura de luxo com piscina privativa e área gourmet.', true, true, 'HL004'),
--   (CORRETORA_ID_2, 'Casa para alugar no Parque São Carlos', 'casa', 'aluguel', 2500, 'Parque São Carlos', 'Três Lagoas', 3, 2, 2, 110, 'Casa com piscina, perto de shopping.', false, true, 'HL005'),
--   (CORRETORA_ID_3, 'Sala comercial no Centro', 'comercial', 'aluguel', 3000, 'Centro', 'Três Lagoas', null, 1, 1, 45, 'Sala comercial com recepção e banheiro.', false, true, 'HL006');

-- 15. VERIFICAÇÃO RÁPIDA (rode depois do seed)
-- select * from public.corretoras;
-- select id, titulo, publicado, destaque, corretora_id from public.imoveis where publicado = true order by created_at desc;
-- select * from public.imovel_fotos;