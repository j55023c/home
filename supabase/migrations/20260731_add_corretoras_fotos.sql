-- ============================================================
-- MIGRAÇÃO: Fotos das Corretoras (Storage + Coluna + Policies)
-- Execute no Supabase SQL Editor
-- ============================================================

-- 1. Bucket para fotos das corretoras (público)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'corretoras-fotos',
  'corretoras-fotos',
  true,
  5242880,  -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Policy: Leitura pública (qualquer um vê a foto)
create policy "Public read corretoras photos"
on storage.objects
for select
using (bucket_id = 'corretoras-fotos');

-- 3. Policy: Upload/Update apenas para usuários autenticados (admin)
create policy "Authenticated upload corretoras photos"
on storage.objects
for insert
with check (
  bucket_id = 'corretoras-fotos'
  and auth.role() = 'authenticated'
);

create policy "Authenticated update corretoras photos"
on storage.objects
for update
using (
  bucket_id = 'corretoras-fotos'
  and auth.role() = 'authenticated'
);

create policy "Authenticated delete corretoras photos"
on storage.objects
for delete
using (
  bucket_id = 'corretoras-fotos'
  and auth.role() = 'authenticated'
);

-- 4. Coluna foto_url na tabela corretoras
alter table corretoras
add column if not exists foto_url text;

-- 5. Comentário para documentação
comment on column corretoras.foto_url is 'URL pública da foto da corretora no Storage (bucket corretoras-fotos)';

-- 6. Índice opcional para buscas por foto
create index if not exists idx_corretoras_foto_url on corretoras(foto_url) where foto_url is not null;

-- ============================================================
-- VERIFICAÇÃO PÓS-EXECUÇÃO
-- ============================================================
-- select * from storage.buckets where id = 'corretoras-fotos';
-- select * from storage.policies where bucket_id = 'corretoras-fotos';
-- select column_name, data_type from information_schema.columns where table_name = 'corretoras' and column_name = 'foto_url';