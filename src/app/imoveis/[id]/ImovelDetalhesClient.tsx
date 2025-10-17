"use client";

import React, { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation";

// --- Interfaces ---
interface Imovel {
  id: number;
  tipo: string;
  transacao: string;
  cidade: string;
  bairro: string;
  rua?: string;
  quartos: number;
  banheiro: number;
  vagas_garagem: number;
  descricao?: string;
  preco: number;
  images?: string[] | null;
  createdAt?: string | Date;
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

interface SwiperOptions {
  navigation?: { nextEl: string; prevEl: string };
  pagination?: { el: string; clickable: boolean };
  spaceBetween?: number;
  slidesPerView?: number;
}

type SwiperConstructor = new (el: HTMLElement, options: SwiperOptions) => unknown;

interface WindowWithSwiper extends Window {
  Swiper?: SwiperConstructor;
}

// --- Componente de Página ---
function ImovelDetalhesPage() {
  const params = useParams();
  const propertyId = typeof params?.id === 'string' ? params.id : null;
  
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const swiperRef = useRef<HTMLDivElement>(null);
  const swiperInstanceRef = useRef<unknown>(null);

  // Efeito para buscar os dados do imóvel
  useEffect(() => {
    if (!propertyId) {
      setPageLoading(false);
      return;
    }

    let isMounted = true;

    const fetchImovel = async (): Promise<void> => {
      setPageLoading(true);
      try {
        const res = await fetch(`/api/imoveis/${propertyId}`);
        if (!res.ok) {
          throw new Error("Imóvel não encontrado.");
        }
        const data = await res.json();
        
        if (isMounted) {
          setImovel(data.imovel);
          setFormData(prev => ({ 
            ...prev, 
            mensagem: `Tenho interesse no imóvel: ${data.imovel.tipo} em ${data.imovel.bairro} (ID: ${data.imovel.id})`
          }));
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          toast.error("Não foi possível carregar os dados do imóvel.");
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    fetchImovel();

    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  // Efeito para registrar visualização
  useEffect(() => {
    if (!propertyId) return;

    const registrarVisualizacao = async (): Promise<void> => {
      try { 
        await fetch(`/api/imoveis/${propertyId}/visualizar`, { method: "POST" }); 
      } catch (error) { 
        console.error("Erro ao registrar visualização:", error); 
      }
    };

    registrarVisualizacao();
  }, [propertyId]);

  // Efeito para carregar o Swiper
  useEffect(() => {
    if (!imovel || !swiperRef.current) return;

    const loadSwiper = (): void => {
      const existingScript = document.querySelector('script[src*="swiper-bundle"]');
      
      if (existingScript) {
        initSwiper();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://unpkg.com/swiper/swiper-bundle.min.js";
      script.async = true;
      script.onload = initSwiper;
      script.onerror = () => console.error("Erro ao carregar Swiper");
      document.body.appendChild(script);
    };

    const initSwiper = (): void => {
      const win = window as WindowWithSwiper;
      
      if (swiperRef.current && win.Swiper && !swiperInstanceRef.current) {
        try {
          swiperInstanceRef.current = new win.Swiper(swiperRef.current, {
            navigation: { 
              nextEl: ".swiper-button-next", 
              prevEl: ".swiper-button-prev" 
            },
            pagination: { 
              el: ".swiper-pagination", 
              clickable: true 
            },
            spaceBetween: 10,
            slidesPerView: 1,
          });
        } catch (error) {
          console.error("Erro ao inicializar Swiper:", error);
        }
      }
    };

    loadSwiper();

    return () => {
      swiperInstanceRef.current = null;
    };
  }, [imovel]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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

      if (!res.ok) {
        throw new Error("Erro ao enviar interesse");
      }

      toast.success("Recebemos seu interesse! Em breve entraremos em contato. 🏡");
      setShowModal(false);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        mensagem: formData.mensagem,
      });
    } catch (error) {
      toast.error("Erro ao enviar. Tente novamente mais tarde.");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("pt-BR", { 
      style: "currency", 
      currency: "BRL" 
    }).format(price);
  };

  // Loading State
  if (pageLoading) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <main className="bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-500 text-lg">A carregar detalhes do imóvel...</p>
          </div>
        </main>
      </>
    );
  }

  // Error State
  if (!propertyId || !imovel) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <main className="bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-red-500 text-xl font-semibold mb-2">Imóvel não encontrado</p>
            <p className="text-slate-600">O imóvel que você procura não existe ou foi removido.</p>
          </div>
        </main>
      </>
    );
  }

  const images = Array.isArray(imovel.images)
    ? imovel.images.filter((src): src is string => typeof src === 'string' && src.length > 0)
    : [];

  return (
    <>
      <Toaster position="top-right" richColors />
      <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
      
      <main className="bg-slate-50 font-sans antialiased text-slate-800">
        <div className="min-h-screen container mx-auto p-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl shadow-slate-200">
            
            {/* Carrossel de Imagens */}
            <div className="lg:col-span-2">
              {images.length > 0 ? (
                <div ref={swiperRef} className="swiper rounded-xl shadow-lg w-full aspect-[16/9] bg-slate-100 overflow-hidden">
                  <div className="swiper-wrapper">
                    {images.map((src, idx) => (
                      <div key={idx} className="swiper-slide">
                        <img 
                          src={src} 
                          alt={`Foto ${idx + 1} do ${imovel.tipo}`} 
                          className="w-full h-full object-cover"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="swiper-pagination"></div>
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-button-next"></div>
                </div>
              ) : (
                <div className="w-full aspect-[16/9] bg-slate-100 flex items-center justify-center text-slate-500 rounded-xl">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📷</div>
                    <p>Sem imagens disponíveis</p>
                  </div>
                </div>
              )}
            </div>

            {/* Detalhes do Imóvel */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 capitalize">
                {imovel.tipo} para {imovel.transacao}
              </h1>
              <p className="text-slate-600 text-lg mt-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {imovel.bairro}, {imovel.cidade}
              </p>

              <div className="my-8 border-t border-slate-200"></div>

              <div className="space-y-5">
                {imovel.rua && (
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Endereço</p>
                      <p className="text-slate-600">{imovel.rua}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <path d="M2 4v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      <path d="M2 10h20" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Quartos</p>
                    <p className="text-slate-600">{imovel.quartos}</p>
                  </div>
                </div>

                {imovel.banheiro > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M21 10H3V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4Z" />
                        <path d="M21 14c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4" />
                        <path d="M4 10v3c0 .6.4 1 1 1h2" />
                        <path d="M20 10v3c0 .6-.4 1-1 1h-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Banheiros</p>
                      <p className="text-slate-600">{imovel.banheiro}</p>
                    </div>
                  </div>
                )}

                {imovel.vagas_garagem > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M22 19v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"/>
                        <path d="M4 15V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"/>
                        <path d="M12 19v-4"/>
                        <path d="M12 15H5"/>
                        <path d="M12 15h7"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Vagas de Garagem</p>
                      <p className="text-slate-600">{imovel.vagas_garagem}</p>
                    </div>
                  </div>
                )}
              </div>

              {imovel.descricao && (
                <>
                  <div className="my-8 border-t border-slate-200"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Sobre o Imóvel</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {imovel.descricao}
                    </p>
                  </div>
                </>
              )}

              <div className="mt-auto pt-8">
                <p className="text-slate-600 text-lg">Valor do imóvel</p>
                <p className="text-4xl font-extrabold text-slate-900 mb-6">
                  {formatPrice(imovel.preco)}
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full block text-center bg-amber-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Tenho Interesse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Interesse */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                aria-label="Fechar modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Demonstrar Interesse</h2>
              <p className="text-slate-600 text-sm mb-6">Preencha o formulário e entraremos em contato</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input 
                    id="nome"
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                    E-mail *
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-slate-700 mb-1">
                    Telefone
                  </label>
                  <input 
                    id="telefone"
                    type="tel" 
                    name="telefone" 
                    value={formData.telefone} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  />
                </div>
                
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-semibold text-slate-700 mb-1">
                    Mensagem
                  </label>
                  <textarea 
                    id="mensagem"
                    name="mensagem" 
                    value={formData.mensagem} 
                    onChange={handleChange} 
                    rows={4} 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={formLoading} 
                  className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {formLoading ? "Enviando..." : "Enviar Interesse"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default ImovelDetalhesPage;