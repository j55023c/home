-- ============================================
-- MIGRAÇÃO COMPLETA: Foto da Corretora (Storage + Coluna)
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Bucket para fotos das corretoras (público)
insert into storage.buckets (id, name, public)
values ('corretoras-fotos', 'corretoras-fotos', true)
on conflict (id) do nothing;

-- 2. Remover policies antigas se existirem
drop policy if exists "Public read corretoras photos" on storage.objects;
drop policy if exists "Admin upload corretoras photos" on storage.objects;
drop policy if exists "Admin update corretoras photos" on storage.objects;
drop policy if exists "Admin delete corretoras photos" on storage.objects;

-- 3. Policies corretas
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

-- 4. Coluna foto_url na tabela corretoras
alter table corretoras
add column if not exists foto_url text;

-- 5. Verificação simples (funciona no Supabase)
select 'Bucket' as tipo, id, name, public from storage.buckets where id = 'corretoras-fotos';
select 'Policy' as tipo, policyname, cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname like '%corretoras%';
select 'Coluna' as tipo, column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = 'corretoras' and column_name = 'foto_url';