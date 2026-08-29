-- ============================================
-- MIGRAÇÃO: Foto da Corretora (Storage + Coluna)
-- Execute no Supabase SQL Editor
-- Versão corrigida: remove policies existentes antes de criar
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

-- 3. Policy: leitura pública das fotos
create policy "Public read corretoras photos"
on storage.objects
for select
using (bucket_id = 'corretoras-fotos');

-- 4. Policy: upload por usuário autenticado
create policy "Admin upload corretoras photos"
on storage.objects
for insert
with check (
  bucket_id = 'corretoras-fotos'
  and auth.role() = 'authenticated'
);

-- 5. Policy: atualização por usuário autenticado
create policy "Admin update corretoras photos"
on storage.objects
for update
using (
  bucket_id = 'corretoras-fotos'
  and auth.role() = 'authenticated'
);

-- 6. Policy: deleção por usuário autenticado
create policy "Admin delete corretoras photos"
on storage.objects
for delete
using (
  bucket_id = 'corretoras-fotos'
  and auth.role() = 'authenticated'
);

-- 7. Coluna foto_url na tabela corretoras
alter table corretoras
add column if not exists foto_url text;

-- 8. Comentário para documentação
comment on column corretoras.foto_url is 'URL pública da foto da corretora (Storage: corretoras-fotos)';

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- select * from storage.buckets where id = 'corretoras-fotos';
-- select * from storage.policies where bucket_id = 'corretoras-fotos';
-- select column_name, data_type from information_schema.columns where table_name = 'corretoras' and column_name = 'foto_url';