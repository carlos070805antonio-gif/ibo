import Image from "next/image";

interface ImovelProps {
  id: number;
  transacao: string;
  tipo: string;
  cidade: string;
  bairro: string;
  quartos: number;
  banheiro: number;
  vagas_garagem: number;
  preco: number;
  images: string[];
}

const BedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-600">
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
);

const ShowerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-600">
    <path d="m4 4 2.5 2.5" />
    <path d="M13.5 6.5a4.95 4.95 0 0 0-7 7" />
    <path d="M15 5 5 15" />
    <path d="M14 17v.01" />
    <path d="M10 16v.01" />
    <path d="M13 13v.01" />
    <path d="M16 10v.01" />
    <path d="M11 20v.01" />
    <path d="M17 14v.01" />
    <path d="M20 11v.01" />
  </svg>
);

const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-600">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

export default function ImovelCard({
  id,
  transacao,
  tipo,
  cidade,
  bairro,
  quartos,
  banheiro,
  vagas_garagem,
  preco,
  images,
}: ImovelProps) {
  const imagemPrincipal = images.length > 0 ? images[0] : null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Imagem Principal */}
      {imagemPrincipal ? (
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={imagemPrincipal}
            alt={`Imagem do imóvel ${id}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="hover:scale-110 transition-transform duration-500"
          />
          {/* Badge de Transação */}
          <div className="absolute top-3 left-3">
            <span className="bg-lime-600 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full shadow-lg">
              {transacao}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-56 bg-slate-200 flex items-center justify-center text-slate-500 rounded-t-2xl">
          <div className="text-center">
            <div className="text-5xl mb-2">🏠</div>
            <p className="text-sm">Sem imagem</p>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-5">
        {/* Título */}
        <h2 className="text-xl font-bold text-slate-900 mb-1 capitalize truncate">
          {tipo}
        </h2>
        
        {/* Localização */}
        <p className="text-slate-600 text-sm mb-4 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{bairro}, {cidade}</span>
        </p>

        {/* Características */}
        <div className="flex items-center gap-4 mb-4 text-slate-700">
          <div className="flex items-center gap-1.5" title={`${quartos} quartos`}>
            <BedIcon />
            <span className="text-sm font-semibold">{quartos}</span>
          </div>
          
          <div className="flex items-center gap-1.5" title={`${banheiro} banheiros`}>
            <ShowerIcon />
            <span className="text-sm font-semibold">{banheiro}</span>
          </div>
          
          {vagas_garagem > 0 && (
            <div className="flex items-center gap-1.5" title={`${vagas_garagem} vagas`}>
              <CarIcon />
              <span className="text-sm font-semibold">{vagas_garagem}</span>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Valor</p>
          <p className="text-lime-700 font-extrabold text-2xl">
            R$ {preco.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Miniaturas das outras imagens */}
      {images.length > 1 && (
        <div className="px-5 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {images.slice(1, 4).map((img, idx) => (
              <div 
                key={idx} 
                className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-lime-600 transition-colors"
              >
                <Image
                  src={img}
                  alt={`Imagem adicional ${idx + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="64px"
                />
              </div>
            ))}
            {images.length > 4 && (
              <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold">
                +{images.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}