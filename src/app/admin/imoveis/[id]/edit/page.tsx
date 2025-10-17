  // app/admin/imoveis/[id]/edit/page.tsx
  "use client";

  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import { toast, Toaster } from "sonner";

  export default function EditImovelPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
      tipo: "",
      transacao: "",
      cidade: "",
      bairro: "",
      quartos: "",
      banheiro: "",
      vagas_garagem: "",
      codigo: "",
      preco: "",
      descricao: "",
      images: [] as string[],
    });

    useEffect(() => {
      fetchImovel();
    }, []);

    async function fetchImovel() {
      try {
        setLoading(true);
        const res = await fetch(`/api/imoveis/${params.id}`);
        const data = await res.json();
        
        if (data.imovel) {
          setFormData({
            tipo: data.imovel.tipo || "",
            transacao: data.imovel.transacao || "",
            cidade: data.imovel.cidade || "",
            bairro: data.imovel.bairro || "",
            quartos: String(data.imovel.quartos || ""),
            banheiro: String(data.imovel.banheiro || ""),
            vagas_garagem: String(data.imovel.vagas_garagem || ""),
            codigo: data.imovel.codigo || "",
            preco: String(data.imovel.preco || ""),
            descricao: data.imovel.descricao || "",
            images: data.imovel.images || [],
          });
        }
      } catch (error) {
        toast.error("Erro ao carregar imóvel");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      const uploaded: string[] = [];

      try {
        for (const file of Array.from(files)) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", file);
          formDataUpload.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            {
              method: "POST",
              body: formDataUpload,
            }
          );

          if (!res.ok) {
            throw new Error(`Erro no upload da imagem ${file.name}`);
          }

          const data = await res.json();
          uploaded.push(data.secure_url);
        }

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploaded],
        }));
        toast.success(`${uploaded.length} imagem(ns) adicionada(s)!`);
      } catch (error) {
        toast.error("Erro ao enviar imagens. Tente novamente.");
        console.error(error);
      } finally {
        setUploading(false);
      }
    }

    function removeImage(index: number) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      toast.info("Imagem removida");
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      if (!formData.tipo || !formData.transacao || !formData.cidade || !formData.bairro || !formData.preco) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      try {
        const body = {
          tipo: formData.tipo,
          transacao: formData.transacao,
          cidade: formData.cidade,
          bairro: formData.bairro,
          quartos: Number(formData.quartos),
          banheiro: Number(formData.banheiro) || 0,
          vagas_garagem: Number(formData.vagas_garagem) || 0,
          codigo: formData.codigo,
          preco: Number(formData.preco),
          descricao: formData.descricao,
          images: formData.images,
        };

        const res = await fetch(`/api/imoveis/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          toast.error("Erro ao atualizar imóvel");
          return;
        }

        toast.success("Imóvel atualizado com sucesso!");
        setTimeout(() => {
          router.push("/admin/imoveis");
        }, 1500);
      } catch (error) {
        toast.error("Erro ao atualizar imóvel");
        console.error(error);
      }
    }

    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando dados...</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <Toaster position="top-right" richColors />
        
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-4xl mx-auto p-6 py-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Editar Imóvel
              </h1>
              <Link
                href="/admin/imoveis"
                className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2"
              >
                ← Voltar para Lista
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Transação */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Transação *</label>
                  <select
                    value={formData.transacao}
                    onChange={(e) => setFormData({ ...formData, transacao: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="venda">Venda</option>
                    <option value="locação">Locação</option>
                    <option value="temporada">Temporada</option>
                  </select>
                </div>

                {/* Tipo */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Tipo de Imóvel *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="loja">Loja</option>
                    <option value="galpão">Galpão</option>
                    <option value="terreno">Terreno</option>
                  </select>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Cidade *</label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                {/* Bairro */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Bairro *</label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                {/* Quartos */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Quartos *</label>
                  <input
                    type="number"
                    value={formData.quartos}
                    onChange={(e) => setFormData({ ...formData, quartos: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                {/* Banheiros */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Banheiros</label>
                  <input
                    type="number"
                    value={formData.banheiro}
                    onChange={(e) => setFormData({ ...formData, banheiro: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Vagas de Garagem */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Vagas de Garagem</label>
                  <input
                    type="number"
                    value={formData.vagas_garagem}
                    onChange={(e) => setFormData({ ...formData, vagas_garagem: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Código */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Código</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Ex: AP001"
                  />
                </div>

                {/* Preço */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-2">Preço (R$) *</label>
                  <input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Descreva o imóvel..."
                />
              </div>

              {/* Imagens */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Imagens ({formData.images.length} selecionada{formData.images.length !== 1 ? "s" : ""})
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleUpload}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    Enviando imagens...
                  </p>
                )}
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {formData.images.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Remover imagem"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploading ? "Processando..." : "Salvar Alterações"}
                </button>
                <Link
                  href="/admin/imoveis"
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-center"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }