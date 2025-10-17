"use client";

import React, { useEffect, useRef, useState, FormEvent, ChangeEvent } from "react";
import { toast, Toaster } from "sonner";
import Link from "next/link";

// --- Ícones ---
const BedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BathIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
    <line x1="10" x2="8" y1="5" y2="7" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <line x1="7" x2="7" y1="19" y2="21" />
    <line x1="17" x2="17" y1="19" y2="21" />
  </svg>
);

const GarageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" />
    <path d="M5 10h14" />
    <path d="M10 16h4" />
  </svg>
);

const AreaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// --- Interfaces ---
interface Imovel {
  id: number;
  tipo: string;
  transacao: string;
  cidade: string;
  bairro: string;
  rua: string;
  quartos: number;
  banheiro: number;
  vagas_garagem: number;
  descricao?: string;
  preco: number;
  images?: string[] | null;
  createdAt?: string | Date;
}

export default function ImovelDetalhesPage() {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [id, setId] = useState<string | undefined>();
  
  const swiperRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const potentialId = pathSegments[pathSegments.length - 1];
      if (potentialId && !isNaN(Number(potentialId))) {
        setId(potentialId);
      } else {
        setPageLoading(false); 
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchImovel = async () => {
      setPageLoading(true);
      try {
        const res = await fetch(`/api/imoveis/${id}`);
        if (!res.ok) throw new Error("Imóvel não encontrado.");
        const data = await res.json();
        setImovel(data.imovel);
        setFormData(prev => ({ ...prev, mensagem: `Tenho interesse no imóvel: ${data.imovel.tipo} em ${data.imovel.bairro} (ID: ${data.imovel.id})`}));
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar os dados do imóvel.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchImovel();
  }, [id]);

  useEffect(() => {
    if(!id) return;
    async function registrarVisualizacao() {
      try { await fetch(`/api/imoveis/${id}/visualizar`, { method: "POST" }); } 
      catch (error) { console.error("Erro ao registrar visualização:", error); }
    }
    registrarVisualizacao();
  }, [id]);

  useEffect(() => {
    if(!imovel) return;
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swiper/swiper-bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
        type SwiperWindow = typeof window & {
            Swiper?: new (el: HTMLElement | string, options: object) => unknown;
        };
        const swiperWindow = window as SwiperWindow;

      if (swiperRef.current && swiperWindow.Swiper) {
        new swiperWindow.Swiper(swiperRef.current, {
          loop: images.length > 1,
          navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
          pagination: { el: ".swiper-pagination", clickable: true },
          spaceBetween: 0,
          slidesPerView: 1,
        });
      }
    };
    return () => { if (script.parentNode) document.body.removeChild(script); };
  }, [imovel]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      toast.error("Por favor, preencha nome e e-mail.");
      return;
    }
    setFormLoading(true);
    try {
      const body = { imovel_id: imovel?.id, ...formData };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao enviar interesse");
      toast.success("Recebemos seu interesse! Em breve entraremos em contato. 🏡");
      setShowModal(false);
    } catch (error) {
      toast.error("Erro ao enviar. Tente novamente mais tarde.");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-lime-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Carregando imóvel...</p>
        </div>
      </main>
    );
  }

  if (!imovel) {
    return (
      <main className="bg-lime-100 min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-7xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Imóvel não encontrado</h2>
          <p className="text-slate-600 mb-6">O imóvel que você procura não existe ou foi removido.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-lime-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lime-700 transition">
            <ArrowLeftIcon />
            Voltar para home
          </Link>
        </div>
      </main>
    )
  }

  const images = Array.isArray(imovel.images)
    ? imovel.images.filter((src): src is string => !!src)
    : [];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  return (
    <>
      <Toaster position="top-right" richColors />
      <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: #fff;
          background: rgba(0,0,0,0.5);
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px;
        }
        .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #65a30d !important;
          opacity: 1;
        }
      `}</style>

      <main className="bg-amber-50 min-h-screen rounded-2xl shadow-lg">
        {/* Header com navegação */}
        <div className="bg-white shadow-sm sticky top-0 z-40 rounded-t-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-lime-600 transition font-semibold">
              <ArrowLeftIcon />
              Voltar
            </Link>
          
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            {images.length > 0 ? (
              <div ref={swiperRef} className="swiper rounded-2xl overflow-hidden w-full h-[60vh] bg-slate-200">
                <div className="swiper-wrapper">
                  {images.map((src, idx) => (
                    <div key={idx} className="swiper-slide">
                      <img src={src} alt={`Foto ${idx + 1} - ${imovel.tipo}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="swiper-pagination"></div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
              </div>
            ) : (
              <div className="w-full h-[60vh] bg-slate-200 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center text-slate-500">
                  <div className="text-8xl mb-4">📷</div>
                  <p className="text-xl">Sem imagens disponíveis</p>
                </div>
              </div>
            )}
          </div>

          {/* Grid Principal */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Coluna Esquerda - Detalhes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card Principal */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block bg-lime-100 text-lime-800 text-xs font-bold uppercase px-3 py-1 rounded-full mb-3">
                      {imovel.transacao}
                    </span>
                    <h1 className="text-4xl font-bold text-slate-900 capitalize leading-tight">
                      {imovel.tipo}
                    </h1>
                  </div>
                  
                </div>
                
                <div className="flex items-center gap-2 text-slate-600 mb-6">
                  <MapPinIcon />
                  <span className="text-lg">{imovel.bairro}, {imovel.rua}, {imovel.cidade}</span>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Características</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 hover:bg-lime-50 transition">
                      <div className="bg-white p-3 rounded-full shadow-sm mb-2 text-lime-600">
                        <BedIcon />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{imovel.quartos}</p>
                      <p className="text-xs text-slate-600 mt-1">Quartos</p>
                    </div>

                    {imovel.banheiro > 0 && (
                      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 hover:bg-lime-50 transition">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-2 text-lime-600">
                          <BathIcon />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{imovel.banheiro}</p>
                        <p className="text-xs text-slate-600 mt-1">Banheiros</p>
                      </div>
                    )}

                    {typeof imovel.vagas_garagem === 'number' && imovel.vagas_garagem > 0 && (
                      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 hover:bg-lime-50 transition">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-2 text-lime-600">
                          <GarageIcon />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{imovel.vagas_garagem}</p>
                        <p className="text-xs text-slate-600 mt-1">Vagas</p>
                      </div>
                    )}

                    
                  </div>
                </div>
              </div>

              {/* Descrição */}
              {imovel.descricao && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-lime-600 rounded-full"></span>
                    Sobre o Imóvel
                  </h2>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {imovel.descricao}
                  </p>
                </div>
              )}

              {/* Localização */}
              {imovel.rua && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-lime-600 rounded-full"></span>
                    Localização
                  </h2>
                  <div className="flex items-start gap-3 text-slate-700">
                    <MapPinIcon />
                    <div>
                      <p className="font-semibold">{imovel.rua}</p>
                      <p className="text-sm text-slate-600">{imovel.bairro}, {imovel.rua}, {imovel.cidade}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coluna Direita - CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6 pb-6 border-b border-slate-200">
                  <p className="text-sm text-slate-500 mb-2">Valor do imóvel</p>
                  <p className="text-4xl font-extrabold text-slate-900">
                    {formatPrice(imovel.preco)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Para {imovel.transacao}</p>
                </div>

                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-lime-600 to-lime-700 text-white font-bold py-4 px-6 rounded-xl hover:from-lime-700 hover:to-lime-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-3"
                >
                  Tenho Interesse
                </button>

                <p className="text-xs text-center text-slate-500">
                  Entre em contato e agende uma visita
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">✓</div>
                    <span>Atendimento rápido</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">✓</div>
                    <span>Visita agendada</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">✓</div>
                    <span>Documentação verificada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in duration-200">
              <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition"
              >
                <CloseIcon />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏡</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Demonstrar Interesse</h2>
                <p className="text-slate-600 text-sm">Preencha seus dados e entraremos em contato</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-lime-500 transition" 
                    placeholder="Seu nome"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-lime-500 transition" 
                    placeholder="seu@email.com"
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                  <input 
                    type="tel" 
                    name="telefone" 
                    value={formData.telefone} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-lime-500 transition" 
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mensagem</label>
                  <textarea 
                    name="mensagem" 
                    value={formData.mensagem} 
                    onChange={handleChange} 
                    rows={4} 
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-lime-500 transition resize-none" 
                    placeholder="Conte-nos mais sobre seu interesse..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={formLoading} 
                  className="w-full bg-gradient-to-r from-lime-600 to-lime-700 text-white font-bold py-4 px-6 rounded-xl hover:from-lime-700 hover:to-lime-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Enviando...
                    </span>
                  ) : (
                    "Enviar Interesse"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}