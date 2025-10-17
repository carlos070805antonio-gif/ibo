// app/admin/page.tsx
import Link from "next/link";

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const TrendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const actions = [
  {
    title: "Adicionar Imóvel",
    description: "Cadastrar um novo imóvel no sistema",
    icon: <PlusIcon />,
    href: "/imoveis/new",
    color: "from-lime-400 to-lime-600",
  },
  {
    title: "Gerenciar Imóveis",
    description: "Visualizar, editar ou excluir imóveis cadastrados",
    icon: <ListIcon />,
    href: "/admin/imoveis",
    color: "from-lime-400 to-lime-600",
  },
  {
    title: "Imóveis Mais Visitados",
    description: "Ver estatísticas de visualizações e acessos",
    icon: <TrendingIcon />,
    href: "/admin/estatisticas",
    color: "from-lime-400 to-lime-600",
  },
  {
    title: "Posição de Destaque",
    description: "Reorganizar ordem dos imóveis em destaque",
    icon: <StarIcon />,
    href: "/admin/destaques",
    color: "from-lime-400 to-lime-600",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Painel Administrativo
          </h1>
          <p className="text-slate-600 text-lg">
            Gerencie seu site de imóveis de forma simples e eficiente
          </p>
        </div>

        {/* Cards de Ações */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-slate-300">
                <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
                
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-lime-600 transition-colors">
                        {action.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    <div className="text-slate-400 group-hover:text-lime-600 group-hover:translate-x-1 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Link para voltar ao site */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-lime-600 font-semibold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar ao Site
          </Link>
        </div>
      </div>
    </div>
  );
}