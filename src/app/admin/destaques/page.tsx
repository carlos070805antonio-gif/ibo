// app/admin/destaques/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";

interface Imovel {
  id: number;
  tipo: string;
  transacao: string;
  bairro: string;
  codigo: string;
  preco: number;
  images?: string[];
  ordem?: number;
}

export default function AdminDestaquesPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchImoveis();
  }, []);

  async function fetchImoveis() {
    try {
      setLoading(true);
      const res = await fetch("/api/imoveis");
      const data = await res.json();
      setImoveis(data.imoveis || []);
    } catch (error) {
      toast.error("Erro ao carregar imóveis");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newImoveis = [...imoveis];
    const draggedItem = newImoveis[draggedIndex];
    
    newImoveis.splice(draggedIndex, 1);
    newImoveis.splice(index, 0, draggedItem);
    
    setImoveis(newImoveis);
    setDraggedIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    toast.success("Ordem atualizada! (Salvar implementação futura)");
  }

  async function salvarOrdem() {
    try {
      const ordens = imoveis.map((imovel, index) => ({
        id: imovel.id,
        ordem: index,
      }));

      const res = await fetch("/api/imoveis/ordem", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordens }),
      });

      if (!res.ok) throw new Error("Erro ao salvar ordem");

      toast.success("Ordem de destaque salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar ordem. Tente novamente.");
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto p-6 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Posição de Destaque
              </h1>
              <p className="text-slate-600">
                Arraste os cards para reorganizar a ordem dos imóveis
              </p>
            </div>
            <Link
              href="/admin"
              className="text-slate-900 hover:text-lime-600 font-semibold flex items-center gap-2"
            >
              ← Voltar ao Painel
            </Link>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <div>
                <p className="font-semibold text-blue-900 mb-1">Como usar:</p>
                <p className="text-blue-800 text-sm">
                  Clique e arraste os cards para reorganizar. Os imóveis no topo aparecerão primeiro na página inicial.
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Imóveis Arrastáveis */}
          <div className="space-y-3">
            {imoveis.map((imovel, index) => (
              <div
                key={imovel.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  bg-white rounded-xl shadow-md p-6 cursor-move hover:shadow-lg transition-all
                  ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                  border-2 border-transparent hover:border-lime-300
                `}
              >
                <div className="flex items-center gap-6">
                  {/* Número da Posição */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Imagem */}
                  <div className="flex-shrink-0">
                    {imovel.images && imovel.images.length > 0 ? (
                      <img
                        src={imovel.images[0]}
                        alt={imovel.tipo}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center text-4xl">
                        🏠
                      </div>
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 capitalize">
                          {imovel.tipo} - {imovel.bairro}
                        </h3>
                        <p className="text-sm text-slate-500 font-mono">
                          Código: {imovel.codigo}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-lime-600">
                        R$ {imovel.preco.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full capitalize">
                        {imovel.transacao}
                      </span>
                    </div>
                  </div>

                  {/* Ícone de Arrastar */}
                  <div className="flex-shrink-0 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Salvar */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={salvarOrdem}
              className="bg-lime-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-300 shadow-lg"
            >
              Salvar Ordem de Destaque
            </button>
          </div>
        </div>
      </div>
    </>
  );
}