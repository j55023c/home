export type Filtros = {
  busca: string;
  status: string;
  publicacao: string; // "todos" | "publicado" | "rascunho"
};

export function BarraFiltro({
  filtros,
  onChange,
}: {
  filtros: Filtros;
  onChange: (novo: Filtros) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row">
      <input
        value={filtros.busca}
        onChange={(e) => onChange({ ...filtros, busca: e.target.value })}
        placeholder="Buscar por título ou bairro..."
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <select
        value={filtros.status}
        onChange={(e) => onChange({ ...filtros, status: e.target.value })}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="todos">Todos os status</option>
        <option value="disponivel">Disponível</option>
        <option value="reservado">Reservado</option>
        <option value="vendido">Vendido</option>
      </select>
      <select
        value={filtros.publicacao}
        onChange={(e) => onChange({ ...filtros, publicacao: e.target.value })}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="todos">Publicados e rascunhos</option>
        <option value="publicado">Só publicados</option>
        <option value="rascunho">Só rascunhos</option>
      </select>
    </div>
  );
}
