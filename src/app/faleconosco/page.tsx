"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";

// --- Ícones como componentes para fácil reutilização ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>
)

const ContactPhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const ContactMailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

const SpinnerIcon = () => ( 
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function FaleConoscoImobiliaria() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast.error("Por favor, preencha os campos de nome, e-mail e mensagem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Ocorreu um problema no servidor.");

      toast.success("Mensagem recebida! Nossa equipe entrará em contato em breve. 🏡");

      setFormData({
        nome: "",
        email: "",
        telefone: "",
        mensagem: "",
      });

    } catch (err) {
      toast.error("Erro ao enviar mensagem. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="bg-slate-50 font-sans antialiased text-slate-800 pt-13">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="grid md:grid-cols-2 items-center gap-16 max-w-6xl w-full mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl shadow-slate-200">

          {/* Coluna da Esquerda: Informações e Imagem */}
          <div className="flex flex-col justify-between h-full">
            <Toaster position="top-right" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Pronto para encontrar seu lar?
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                Preencha o formulário ou utilize nossos canais de atendimento. Nossa equipe está pronta para ajudar você.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-lime-100 p-3 rounded-full"><ContactPhoneIcon /></div>
                  <div>
                    <p className="font-semibold text-slate-900">Telefone</p>
                    <a href="tel:+55 (32) 3722-5927" className="text-slate-600 hover:text-lime-600 transition-colors">+55 (32) 3722-5927</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-lime-100 p-3 rounded-full"><ContactMailIcon /></div>
                  <div>
                    <p className="font-semibold text-slate-900">E-mail</p>
                    <a href="mailto:joanimoveis@hotmail.com" className="text-slate-600 hover:text-lime-600 transition-colors">joanimoveis@hotmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-lime-100 p-3 rounded-full"><BuildingIcon /></div>
                  <div>
                    <p className="font-semibold text-slate-900">Nosso Escritório</p>
                    <p className="text-slate-600">RUA DOUTOR AFONSO CANEDO, Nº 23, Centro - Muriaé / MG - Loja 04 CEP 36880-000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block mt-auto">
              <img
                src="fachadaap.jpg"
                alt="Fachada de um prédio moderno"
                className="rounded-lg object-cover w-full h-64 shadow-lg"
              />
            </div>
          </div>

          {/* Coluna da Direita: Formulário */}
          <div className="bg-slate-100 p-8 rounded-xl shadow-inner shadow-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Envie sua mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon />
                  <input
                    type="text"
                    name="nome"
                    id="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
                <div className="relative">
                  <MailIcon />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
                    placeholder="voce@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-slate-700 mb-1">Telefone (Opcional)</label>
                <div className="relative">
                  <PhoneIcon />
                  <input
                    type="tel"
                    name="telefone"
                    id="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mensagem" className="block text-sm font-semibold text-slate-700 mb-1">Mensagem</label>
                <textarea
                  name="mensagem"
                  id="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-lime-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    Enviando...
                  </>
                ) : (
                  "Enviar Contato"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

