-- ============================================
-- DIAGNÓSTICO COMPLETO - Execute no Supabase SQL Editor
-- ============================================

-- 1. Bucket existe?
select 'BUCKET' as check, id, name, public, created_at
from storage.buckets
where id = 'corretoras-fotos';

-- 2. Policies existem?
select 'POLICY' as check, policyname, cmd, permissive, roles, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname like '%corretoras%';

-- 3. Coluna existe?
select 'COLUNA' as check, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'corretoras'
  and column_name = 'foto_url';

-- 4. Dados de teste - tem corretoras?
select 'DADOS' as check, id, nome, whatsapp, creci, foto_url, auth_user_id
from public.corretoras
limit 5;

-- 5. RLS está ativo na tabela corretoras?
select 'RLS' as check, relname, relrowsecurity
from pg_class
where relname = 'corretoras';

-- 6. Policies RLS na tabela corretoras
select 'RLS_POLICY' as check, policyname, cmd, permissive, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'corretoras';