-- ============================================
-- CORRECAO_FINAL.sql - Versão com DROP IF EXISTS completo
-- ============================================

-- 1. STORAGE BUCKET
insert into storage.buckets (id, name, public)
values ('corretoras-fotos', 'corretoras-fotos', true)
on conflict (id) do nothing;

-- 2. STORAGE POLICIES
drop policy if exists "Public read corretoras photos" on storage.objects;
drop policy if exists "Admin upload corretoras photos" on storage.objects;
drop policy if exists "Admin update corretoras photos" on storage.objects;
drop policy if exists "Admin delete corretoras photos" on storage.objects;

create policy "Public read corretoras photos"
on storage.objects for select
using (bucket_id = 'corretoras-fotos');

create policy "Admin upload corretoras photos"
on storage.objects for insert
with check (bucket_id = 'corretoras-fotos' and auth.role() = 'authenticated');

create policy "Admin update corretoras photos"
on storage.objects for update
using (bucket_id = 'corretoras-fotos' and auth.role() = 'authenticated');

create policy "Admin delete corretoras photos"
on storage.objects for delete
using (bucket_id = 'corretoras-fotos' and auth.role() = 'authenticated');

-- 3. TABLE RLS POLICIES (corretoras) - DROP TODAS ANTES
drop policy if exists "Admin update own corretora" on public.corretoras;
drop policy if exists "Admin update corretora" on public.corretoras;
drop policy if exists "Admin insert corretora" on public.corretoras;
drop policy if exists "Admin delete corretora" on public.corretoras;
drop policy if exists "Admin delete own corretora" on public.corretoras;

-- Recriar
create policy "Admin update own corretora"
on public.corretoras
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

create policy "Admin insert corretora"
on public.corretoras
for insert
to authenticated
with check (true);

create policy "Admin delete own corretora"
on public.corretoras
for delete
to authenticated
using (auth_user_id = auth.uid());

-- 4. COLUNA foto_url
alter table public.corretoras
add column if not exists foto_url text;

-- 5. VERIFICAÇÃO
select 'BUCKET' as tipo, id, name, public from storage.buckets where id = 'corretoras-fotos';
select 'STORAGE_POLICY' as tipo, policyname, cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname like '%corretoras%';
select 'TABLE_POLICY' as tipo, policyname, cmd, permissive, roles from pg_policies where schemaname = 'public' and tablename = 'corretoras';
select 'COLUNA' as tipo, column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = 'corretoras' and column_name = 'foto_url';