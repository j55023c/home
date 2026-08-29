export type StatusImovel = "disponivel" | "reservado" | "vendido";

export type Imovel = {
  id: string;
  titulo: string;
  tipo: string;
  finalidade: string;
  preco: number | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  area_m2: number | null;
  area_util: number | null;
  suites: number | null;
  ano_construcao: number | null;
  iptu: number | null;
  condominio: number | null;
  taxas: number | null;
  caracteristicas: string[];
  descricao: string | null;
  observacoes: string | null;
  corretora_id: string;
  destaque: boolean;
  status: StatusImovel;
  publicado: boolean;
  created_at: string;
  updated_at: string;
};

export type ImovelFoto = {
  id: string;
  imovel_id: string;
  url: string;
  ordem: number;
};