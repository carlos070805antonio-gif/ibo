"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import Image from "next/image";

const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);

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

export default function NovoImovelPage() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploaded: string[] = []; 

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        uploaded.push(data.secure_url);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    toast.success(`${uploaded.length} imagem(ns) enviada(s) com sucesso!`);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      transacao: formData.get("transacao"),
      tipo: formData.get("tipo"),
      cidade: formData.get("cidade"),
      bairro: formData.get("bairro"),
      rua: formData.get("rua"),
      quartos: Number(formData.get("quartos")),
      banheiro: Number(formData.get("banheiro")),
      vagas_garagem: Number(formData.get("vagas_garagem")),
      codigo: formData.get("codigo"),
      preco: Number(formData.get("preco")),
      descricao: formData.get("descricao"),
      images: images,
    };

    if (images.length === 0) {
      toast.error("Por favor, adicione pelo menos uma imagem.");
      return;
    }

    const res = await fetch("/api/imoveis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      toast.error("Erro ao cadastrar imóvel.");
      return;
    }

    toast.success("Imóvel cadastrado com sucesso!");
    window.location.href = "/";
  }

  return (
    <main className="bg-slate-50 min-h-screen p-4 py-10 font-sans antialiased text-slate-800">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl shadow-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Cadastrar Novo Imóvel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de transação</label>
              <select name="transacao" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required>
                <option value="venda">Venda</option>
                <option value="locação">Locação</option>
                <option value="temporada">Temporada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de imóvel</label>
              <select name="tipo" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Loja">Loja</option>
                <option value="Galpão">Galpão</option>
                <option value="Terreno">Terreno</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cidade</label>
              <input type="text" name="cidade" defaultValue="Muriaé" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Bairro</label>
              <select name="bairro" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required>
                <option value="">Selecione um bairro</option>
                {BAIRROS_MURIAE.map((bairro) => (
                  <option key={bairro} value={bairro}>{bairro}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Rua/Endereço</label>
            <input type="text" name="rua" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" placeholder="Opcional" />
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Quartos</label>
              <select name="quartos" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                <option value="6">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Banheiros</label>
              <select name="banheiro" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                <option value="6">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Vagas Garagem</label>
              <select name="vagas_garagem" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required>
                <option value="0">Nenhuma</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                <option value="6">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Preço (R$)</label>
              <input name="preco" type="number" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Código do Imóvel</label>
            <input name="codigo" type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" placeholder="Ex: IMV-001" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Descrição do Imóvel</label>
            <textarea name="descricao" rows={6} className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lime-600 transition" placeholder="Detalhes sobre o imóvel, diferenciais, etc." required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Imagens</label>
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                <UploadIcon />
                <p className="mb-2 text-sm"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                <p className="text-xs">PNG, JPG</p>
              </div>
              <input id="image-upload" type="file" multiple onChange={handleUpload} accept="image/*" className="hidden" />
            </label>
            {uploading && <p className="text-sm text-lime-600 mt-2">Enviando imagens, por favor aguarde...</p>}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                {images.map((src, idx) => (
                  <div key={idx} className="relative w-full h-24">
                    <Image
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover rounded-md border border-slate-200 shadow-sm"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-lime-600 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 transition-all">
            {uploading ? (<><SpinnerIcon /> Processando...</>) : "Cadastrar Imóvel"}
          </button>
        </form>
      </div>
    </main>
  );
}