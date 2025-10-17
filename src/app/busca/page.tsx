// app/busca/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import ImovelCard from "@/components/card/ImovelCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Imovel {
  id: number;
  transacao: string;
  tipo: string;
  cidade: string;
  bairro: string;
  quartos: number;
  banheiro: number;
  vagas_garagem: number;
  codigo: string;
  preco: number;
  images?: string[];
  createdAt: string;
}

export default function BuscaPage() {
  const searchParams = useSearchParams();
  const [ordenacao, setOrdenacao] = useState("recente");
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImoveis() {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams.toString());
        const res = await fetch(`/api/imoveis?${params.toString()}`);
        const data = await res.json();
        setImoveis(data.imoveis || []);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        setImoveis([]);
      } finally {
        setLoading(false);
      }
    }

    fetchImoveis();
  }, [searchParams]);

  // Aplicar ordenação
  const imoveisOrdenados = useMemo(() => {
    const lista = [...imoveis];
    
    switch (ordenacao) {
      case "recente":
        return lista.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "menor-preco":
        return lista.sort((a, b) => a.preco - b.preco);
      case "maior-preco":
        return lista.sort((a, b) => b.preco - a.preco);
      case "mais-quartos":
        return lista.sort((a, b) => b.quartos - a.quartos);
      default:
        return lista;
    }
  }, [imoveis, ordenacao]);

  // Criar descrição dos filtros ativos
  const filtrosAtivos: string[] = [];
  const transacao = searchParams.get("transacao");
  const tipo = searchParams.get("tipo");
  const cidade = searchParams.get("cidade");
  const bairro = searchParams.get("bairro");
  const quartos = searchParams.get("quartos");
  const precoMin = searchParams.get("precoMin");
  const precoMax = searchParams.get("precoMax");

  if (transacao) filtrosAtivos.push(`Transação: ${transacao}`);
  if (tipo) filtrosAtivos.push(`Tipo: ${tipo}`);
  if (cidade) filtrosAtivos.push(`Cidade: ${cidade}`);
  if (bairro) filtrosAtivos.push(`Bairro: ${bairro}`);
  if (quartos) filtrosAtivos.push(`Quartos: ${quartos}`);
  if (precoMin) filtrosAtivos.push(`Preço mín: R$ ${Number(precoMin).toLocaleString()}`);
  if (precoMax) filtrosAtivos.push(`Preço máx: R$ ${Number(precoMax).toLocaleString()}`);

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Buscando imóveis...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header com filtros ativos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900">
              Resultados da Busca
            </h1>
            <Link
              href="/"
              className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2"
            >
              ← Voltar à busca
            </Link>
          </div>

          {filtrosAtivos.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-2">Filtros aplicados:</p>
              <div className="flex flex-wrap gap-2">
                {filtrosAtivos.map((filtro: string, index: number) => (
                  <span
                    key={index}
                    className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full"
                  >
                    {filtro}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Barra de ordenação e contagem */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <p className="text-slate-600">
              <strong>{imoveisOrdenados.length}</strong> {imoveisOrdenados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
            </p>

            {imoveisOrdenados.length > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700">
                  Ordenar por:
                </label>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="recente">Mais recentes</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                  <option value="mais-quartos">Mais quartos</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        {imoveisOrdenados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Nenhum imóvel encontrado
            </h2>
            <p className="text-slate-600 mb-6">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <Link
              href="/"
              className="inline-block bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition"
            >
              Nova Busca
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveisOrdenados.map((imovel: Imovel) => (
              <Link key={imovel.id} href={`/imoveis/${imovel.id}`} passHref>
                <div className="cursor-pointer">
                  <ImovelCard
                    id={imovel.id}
                    transacao={imovel.transacao}
                    tipo={imovel.tipo}
                    cidade={imovel.cidade}
                    bairro={imovel.bairro}
                    quartos={imovel.quartos}
                    banheiro={imovel.banheiro}
                    vagas_garagem={imovel.vagas_garagem}
                    preco={imovel.preco}
                    images={imovel.images?.slice(0, 1) || []}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}