// app/admin/imoveis/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";

interface Imovel {
  id: number;
  tipo: string;
  transacao: string;
  cidade: string;
  bairro: string;
  quartos: number;
  codigo: string;
  preco: number;
  images?: string[];
  createdAt: string;
}

export default function AdminImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

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

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

    try {
      const res = await fetch(`/api/imoveis/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      toast.success("Imóvel excluído com sucesso!");
      fetchImoveis(); // Recarrega a lista
    } catch (error) {
      toast.error("Erro ao excluir imóvel");
      console.error(error);
    }
  }

  const imoveisFiltrados = imoveis.filter((imovel) =>
    imovel.bairro.toLowerCase().includes(filter.toLowerCase()) ||
    imovel.cidade.toLowerCase().includes(filter.toLowerCase()) ||
    imovel.tipo.toLowerCase().includes(filter.toLowerCase()) ||
    imovel.codigo.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Gerenciar Imóveis
              </h1>
              <p className="text-slate-600">
                Total: <strong>{imoveis.length}</strong> imóveis cadastrados
              </p>
            </div>
            <Link
              href="/admin"
              className="text-slate-900 hover:text-lime-600 font-semibold flex items-center gap-2"
            >
              ← Voltar ao Painel
            </Link>
          </div>

          {/* Busca */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por bairro, cidade, tipo ou código..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600"
            />
          </div>

          {/* Lista de Imóveis */}
          {imoveisFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Nenhum imóvel encontrado
              </h2>
              <p className="text-slate-600 mb-6">
                {filter ? "Tente buscar com outros termos" : "Adicione seu primeiro imóvel"}
              </p>
              {!filter && (
                <Link
                  href="/imoveis/new"
                  className="inline-block bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition"
                >
                  Adicionar Imóvel
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Imagem</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Código</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Tipo</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Localização</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Preço</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Quartos</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {imoveisFiltrados.map((imovel) => (
                      <tr key={imovel.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          {imovel.images && imovel.images.length > 0 ? (
                            <img
                              src={imovel.images[0]}
                              alt={imovel.tipo}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                              🏠
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                            {imovel.codigo}
                          </span>
                        </td>
                        <td className="px-6 py-4 capitalize">
                          <span className="text-sm font-semibold text-slate-700">
                            {imovel.tipo}
                          </span>
                          <br />
                          <span className="text-xs text-slate-500 capitalize">
                            {imovel.transacao}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-700">
                            {imovel.bairro}
                          </div>
                          <div className="text-xs text-slate-500">
                            {imovel.cidade}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900">
                            R$ {imovel.preco.toLocaleString("pt-BR")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-700">
                            {imovel.quartos} quartos
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/imoveis/${imovel.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Visualizar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Link>
                            <Link
                              href={`/admin/imoveis/${imovel.id}/edit`}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(imovel.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}