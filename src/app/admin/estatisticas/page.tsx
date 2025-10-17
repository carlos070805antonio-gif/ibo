// app/admin/estatisticas/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ImovelEstatistica {
  id: number;
  tipo: string;
  bairro: string;
  codigo: string;
  preco: number;
  transacao: string;
  images?: string[];
  visualizacoes: number;
}

export default function AdminEstatisticasPage() {
  const [imoveis, setImoveis] = useState<ImovelEstatistica[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mes");

  useEffect(() => {
    fetchEstatisticas();
  }, [periodo]);

  async function fetchEstatisticas() {
    try {
      setLoading(true);
      const res = await fetch("/api/imoveis");
      const data = await res.json();
      
      // Usar visualizações reais do banco de dados
      const comVisualizacoes = (data.imoveis || []).map((imovel: ImovelEstatistica) => ({
        ...imovel,
        visualizacoes: imovel.visualizacoes || 0, // Dados reais
      }));
      
      // Ordenar por visualizações (decrescente)
      comVisualizacoes.sort((a: ImovelEstatistica, b: ImovelEstatistica) => 
        b.visualizacoes - a.visualizacoes
      );
      
      setImoveis(comVisualizacoes);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  }

  const totalVisualizacoes = imoveis.reduce((acc, imovel) => acc + imovel.visualizacoes, 0);
  const mediaVisualizacoes = imoveis.length > 0 ? Math.round(totalVisualizacoes / imoveis.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Estatísticas e Mais Visitados
            </h1>
            <p className="text-slate-600">
              Acompanhe o desempenho dos seus imóveis
            </p>
          </div>
          <Link
            href="/admin"
            className="text-slate-900 hover:text-lime-600 font-semibold flex items-center gap-2"
          >
            ← Voltar ao Painel
          </Link>
        </div>

        {/* Cards de Resumo */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Total de Visualizações</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{totalVisualizacoes.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Média por Imóvel</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{mediaVisualizacoes.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Imóveis Ativos</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            <p className="text-4xl font-bold">{imoveis.length}</p>
          </div>
        </div>

        {/* Filtro de Período */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-slate-700">Período:</label>
            <div className="flex gap-2">
              {["semana", "mes", "trimestre", "ano"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    periodo === p
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de Imóveis Mais Visitados */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              🏆 Ranking de Imóveis Mais Visitados
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Posição</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Imagem</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Imóvel</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Localização</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Preço</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Visualizações</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {imoveis.map((imovel, index) => (
                  <tr key={imovel.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                        ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : ''}
                        ${index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' : ''}
                        ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' : ''}
                        ${index > 2 ? 'bg-slate-300 text-slate-700' : ''}
                      `}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {imovel.images && imovel.images.length > 0 ? (
                        <img
                          src={imovel.images[0]}
                          alt={imovel.tipo}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-2xl">
                          🏠
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 capitalize">
                        {imovel.tipo}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {imovel.codigo}
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded capitalize">
                        {imovel.transacao}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {imovel.bairro}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        R$ {imovel.preco.toLocaleString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span className="font-bold text-purple-600 text-lg">
                          {imovel.visualizacoes.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/imoveis/${imovel.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        Ver imóvel →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nota sobre implementação */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 mt-0.5 flex-shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-900 mb-1">💡 Nota de Implementação</p>
              <p className="text-yellow-800 text-sm">
                Os dados de visualização são simulados. Para implementação real, integre com Google Analytics ou adicione sistema de tracking próprio salvando visualizações no banco de dados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}