"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// Bairros de Muriaé-MG
const BAIRROS_MURIAE = [
  "Aeroporto", "Alto do Castelo", "Alterosa", "Aparecida", "Armação", "Barra", 
  "Bela Vista", "Belisário", "Bom Pastor", "Bom Retiro", "Cardoso de Melo", "Centro", 
  "Chácara Brum", "Colety", "Coronel Izalino", "Divisório", "Dornelas", "Encoberto", 
  "Engenho Dornelas", "Franco Suiço", "Gávea", "Inconfidência", "Ivaí", "Jacyra", 
  "Jardim", "João XXIII", "José Cirilo", "Kennedy", "Marambaia", "Napoleão", 
  "Nova Muriaé", "Prainha", "Primavera", "Planalto", "Porto", "Pátria Nova", 
  "Recanto Verde", "Rosário", "Santa Terezinha", "Santana", "Safira", "Santo Antônio", 
  "São Cristóvão", "São Francisco", "São Gotardo", "São Joaquim", "São Pedro", 
  "São Vicente de Paulo", "Sofocó", "Sossego", "União", "Universitário", 
  "Vale do Castelo", "Vale Verde", "Vermelho", "Vila Conceição", "Vila Major", "Vila Terezinha"
].sort();


export default function SearchFilter() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    transacao: "",
    tipo: "",
    cidade: "Muriaé",
    bairro: "",
    quartos: "",
    precoMin: "",
    precoMax: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Construir query string com filtros preenchidos
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });
    
    // Redirecionar para página de resultados com filtros
    router.push(`/busca?${params.toString()}`);
  };

  const handleClear = () => {
    setFilters({
      transacao: "",
      tipo: "",
      cidade: "Muriaé",
      bairro: "",
      quartos: "",
      precoMin: "",
      precoMax: "",
    });
  };

  return (
    <section className="bg-white border-2 py-12 px-4 border-lime-700 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Encontre seu Imóvel Ideal
          </h1>
          <p className="text-slate-600 text-lg">
            Use os filtros abaixo para encontrar o imóvel perfeito para você em Muriaé
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            
            {/* Transação */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Transação
              </label>
              <select
                name="transacao"
                value={filters.transacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 bg-white"
              >
                <option value="">Todas</option>
                <option value="venda">Venda</option>
                <option value="locação">Locação</option>
                <option value="temporada">Temporada</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tipo de Imóvel
              </label>
              <select
                name="tipo"
                value={filters.tipo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 bg-white"
              >
                <option value="">Todos</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="loja">Loja</option>
                <option value="galpão">Galpão</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bairro
              </label>
              <select
                name="bairro"
                value={filters.bairro}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 bg-white"
              >
                <option value="">Todos os bairros</option>
                {BAIRROS_MURIAE.map((bairro) => (
                  <option key={bairro} value={bairro}>
                    {bairro}
                  </option>
                ))}
              </select>
            </div>

            {/* Quartos */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Quartos
              </label>
              <select
                name="quartos"
                value={filters.quartos}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 bg-white"
              >
                <option value="">Qualquer</option>
                <option value="1">1 quarto</option>
                <option value="2">2 quartos</option>
                <option value="3">3 quartos</option>
                <option value="4">4 quartos</option>
                <option value="5+">5+ quartos</option>
              </select>
            </div>

            {/* Preço Mínimo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preço Mínimo
              </label>
              <input
                type="number"
                name="precoMin"
                value={filters.precoMin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600"
                placeholder="R$"
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preço Máximo
              </label>
              <input
                type="number"
                name="precoMax"
                value={filters.precoMax}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600"
                placeholder="R$"
              />
            </div>

          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-lime-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105  flex items-center justify-center gap-2"
            >
              <SearchIcon />
              Buscar Imóveis
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              className="sm:w-auto px-6 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}