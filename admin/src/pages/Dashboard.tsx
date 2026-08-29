import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { ImovelCard } from "../components/ImovelCard";
import { ImovelForm } from "../components/ImovelForm";
import { CorretoraProfile } from "../components/CorretoraProfile";
import { Plus, LogOut, LayoutDashboard, Home, User, Settings, Menu, X, ChevronDown } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

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
      {/* Mobile sidebar overlay */}
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: slide in/out */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isDesktop ? "translate-x-0" : sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 lg:justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <LayoutDashboard size={18} className="text-black" />
            </div>
            <h1 className="font-display text-xl font-bold text-slate-900">Home Admin</h1>
          </div>
          {!isDesktop && (
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab("imoveis");
              if (!isDesktop) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "imoveis"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "imoveis" ? "bg-white/20" : "bg-slate-100"}`}>
              <LayoutDashboard size={20} className={activeTab === "imoveis" ? "text-white" : "text-slate-600"} />
            </div>
            <span>Meus Imóveis</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab("perfil");
              if (!isDesktop) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "perfil"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "perfil" ? "bg-white/20" : "bg-slate-100"}`}>
              <User size={20} className={activeTab === "perfil" ? "text-white" : "text-slate-600"} />
            </div>
            <span>Minha Foto no Site</span>
          </button>
        </nav>

        {/* Sidebar Footer - User info mobile */}
        <div className="p-4 border-t border-slate-200 lg:hidden">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{nome}</p>
              <p className="text-xs text-slate-500">Corretora</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>

        {/* Desktop user info - bottom of sidebar */}
        <div className="hidden lg:block p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{nome}</p>
              <p className="text-xs text-slate-500">Corretora</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 lg:px-8">
          <div className="flex h-full items-center justify-between gap-4">
            {/* Mobile menu button */}
            {!isDesktop && (
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu size={24} className="text-slate-600" />
              </button>
            )}

            {/* Page Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-slate-900 truncate">
                {activeTab === "imoveis" ? "Meus Imóveis" : "Minha Foto no Site"}
              </h1>
              {isDesktop && activeTab === "perfil" && (
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Configure como sua foto aparece na vitrine e na página Sobre
                </p>
              )}
            </div>

            {/* Desktop: User profile + logout */}
            <div className="hidden lg:flex items-center gap-4">
              {/* User info */}
              <div className="flex items-center gap-3 pr-4">
                <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-white" />
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 truncate max-w-xs">{nome}</p>
                  <p className="text-xs text-slate-500">Corretora</p>
                </div>
              </div>
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>

            {/* Mobile: user avatar only in header */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {activeTab === "imoveis" && (
            <>
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Meus Imóveis</h2>
                  <p className="text-slate-500 mt-1">
                    {imoveis.length} imóvel{imoveis.length !== 1 ? "is" : ""} cadastrado{imoveis.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={handleNovoImovel}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                >
                  <Plus size={18} />
                  <span>Novo imóvel</span>
                </button>
              </div>

              {/* Properties Grid */}
              {loadingImoveis ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] rounded-xl bg-slate-200" />
                      <div className="mt-3 space-y-2">
                        <div className="h-4 w-3/4 bg-slate-200 rounded" />
                        <div className="h-4 w-1/2 bg-slate-200 rounded" />
                        <div className="h-4 w-1/3 bg-slate-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : imoveis.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <Home className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum imóvel cadastrado</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">Comece criando seu primeiro imóvel para aparecer aqui.</p>
                  <button
                    onClick={handleNovoImovel}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
                  >
                    <Plus size={20} />
                    Criar primeiro imóvel
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="max-w-2xl mx-auto">
              <CorretoraProfile onAtualizado={() => {}} />
            </div>
          )}
        </div>
      </main>

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