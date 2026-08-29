-- ============================================
-- ADICIONAR COLUNA OBSERVACOES NA TABELA IMOVEIS
-- Execute no Supabase SQL Editor
-- ============================================

alter table public.imoveis
add column if not exists observacoes text;

comment on column public.imoveis.observacoes is 'Observações internas da imobiliária (não aparece no site vitrine)';

-- Verificação
select column_name, data_type, is_nullable 
from information_schema.columns 
where table_schema = 'public' 
  and table_name = 'imoveis' 
  and column_name = 'observacoes';