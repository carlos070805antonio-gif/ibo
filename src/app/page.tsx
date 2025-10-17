import ImovelCard from "@/components/card/ImovelCard";
import Link from "next/link";
import { getImoveis } from "./lib/imoveis";
import SearchFilter from "@/components/SearchFilter";

type ImovelServer = {
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
};

export default function HomePage() {
  // Buscar imóveis do JSON (servidor)
  const imoveisRaw = getImoveis();

  // Transformar os dados para o formato esperado
  const imoveis = imoveisRaw.map((i: ImovelServer) => ({
    ...i,
    preco: Number(i.preco),
    images: Array.isArray(i.images) ? i.images : [],
  }));

  return (
    <>

      {/* Buscador no topo da página */}
      <SearchFilter />

      {/* Lista de imóveis em destaque */}
      <section className="max-w-6xl mx-auto p-6 py-12">
        <h2 className="text-5xl font-bold text-slate-900 mb-6 text-center">
          Imóveis em Destaque
        </h2>

        {imoveis.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-md">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-slate-600 text-lg">Nenhum imóvel cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveis.map((imovel) => (
              <Link key={imovel.id} href={`/imoveis/${imovel.id}`} passHref>
                <div className="cursor-pointer hover:scale-105 transition-transform duration-300">
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
                    images={imovel.images.slice(0, 1)}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}