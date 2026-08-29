import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { ImovelCard } from "../components/ImovelCard";
import { ImovelForm } from "../components/ImovelForm";
import { CorretoraProfile } from "../components/CorretoraProfile";
import { Plus, LogOut, LayoutDashboard, Home, User, Settings } from "lucide-react";

export function Dashboard() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [corretoraId, setCorretoraId] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [loadingCorretora, setLoadingCorretora] = useState(true);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [loadingImoveis, setLoadingImoveis] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imovelEditando, setImovelEditando] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"imoveis" | "perfil">("imoveis");

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    supabase
      .from("corretoras")
      .select("id, nome, whatsapp, creci, foto_url")
      .eq("auth_user_id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao buscar corretora:", error.message);
          return;
        }
        if (data) {
          setCorretoraId(data.id);
          setNome(data.nome);
          setWhatsapp(data.whatsapp);
        }
        setLoadingCorretora(false);
      });
  }, [session, navigate]);

  async function carregarImoveis(corretora: string) {
    setLoadingImoveis(true);
    const { data, error } = await supabase
      .from("imoveis")
      .select("*")
      .eq("corretora_id", corretora)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar imóveis:", error.message);
      return;
    }
    setImoveis(data ?? []);
    setLoadingImoveis(false);
  }

  useEffect(() => {
    if (corretoraId) {
      carregarImoveis(corretoraId);
    }
  }, [corretoraId]);

  function handleNovoImovel() {
    setImovelEditando(null);
    setShowForm(true);
  }

  function handleEditarImovel(imovel: any) {
    setImovelEditando(imovel);
    setShowForm(true);
  }

  function handleFecharForm() {
    setShowForm(false);
    setImovelEditando(null);
  }

  function handleSalvo() {
    if (corretoraId) carregarImoveis(corretoraId);
    handleFecharForm();
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  if (loadingCorretora) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
      </div>
    );
  }

  if (!corretoraId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Corretora não vinculada
          </h1>
          <p className="text-slate-500">
            Não encontramos um cadastro de corretora vinculado a este login.
            Entre em contato com o administrador.
          </p>
          <button
            onClick={handleLogout}
            className="mt-6 rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar + Header */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
          <div className="flex h-16 items-center justify-center border-b border-slate-200">
            <h1 className="font-display text-xl text-slate-900">Home Admin</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveTab("imoveis")}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "imoveis"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard size={20} />
              Meus Imóveis
            </button>
            <button
              onClick={() => setActiveTab("perfil")}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "perfil"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <User size={20} />
              Minha Foto no Site
            </button>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 lg:px-8">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-900">
                {activeTab === "imoveis" ? "Meus Imóveis" : "Minha Foto no Site"}
              </h1>
              <p className="text-sm text-slate-500">
                {activeTab === "imoveis"
                  ? "Gerencie seus imóveis publicados e rascunhos"
                  : "Configure como sua foto aparece na vitrine e na página Sobre"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900">{nome}</p>
                <p className="text-xs text-slate-400">Corretora</p>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6 lg:p-8">
            {activeTab === "imoveis" && (
              <>
                {/* Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Seus imóveis</h2>
                    <p className="text-sm text-slate-500">
                      {imoveis.length} imóvel{imoveis.length !== 1 ? "is" : ""} cadastrado{imoveis.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={handleNovoImovel}
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus size={18} />
                    Novo imóvel
                  </button>
                </div>

                {/* Lista de imóveis */}
                {loadingImoveis ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-[4/3] rounded-xl bg-slate-200" />
                        <div className="mt-3 h-4 w-3/4 bg-slate-200 rounded" />
                        <div className="mt-2 h-4 w-1/2 bg-slate-200 rounded" />
                        <div className="mt-2 h-4 w-1/3 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : imoveis.length === 0 ? (
                  <div className="text-center py-16">
                    <Home className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum imóvel cadastrado</h3>
                    <p className="text-slate-500 mb-6">Comece criando seu primeiro imóvel.</p>
                    <button
                      onClick={handleNovoImovel}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
                    >
                      <Plus size={20} /> Criar primeiro imóvel
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {imoveis.map((imovel) => (
                      <ImovelCard
                        key={imovel.id}
                        imovel={imovel}
                        corretoraWhatsapp={whatsapp}
                        onEditar={handleEditarImovel}
                        onAtualizado={handleSalvo}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "perfil" && (
              <div className="max-w-3xl mx-auto">
                <CorretoraProfile onAtualizado={() => {}} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Novo/Editar Imóvel */}
      {showForm && (
        <ImovelForm
          corretoraId={corretoraId}
          imovelExistente={imovelEditando}
          onFechar={handleFecharForm}
          onSalvo={handleSalvo}
        />
      )}
    </div>
  );
}