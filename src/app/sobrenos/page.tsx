"use client";

import React from 'react';

// --- Ícones como componentes para fácil reutilização ---
const BuildingOfficeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-600"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
);

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-600"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const PhoneCallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);


export default function SobreNos() {
  return (
    <main className="bg-slate-50 font-sans antialiased text-slate-800 pt-0 rounded-2xl">
      <div className="container mx-auto px-2 py-10 sm:py-12">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-0">
          <div className="flex justify-center mb-4">
              <div className="bg-lime-100 p-4 rounded-full">
                <BuildingOfficeIcon />
              </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Sobre a Joan Imóveis
          </h1>
          <p className="text-lg text-slate-600">
            A nossa trajetória é construída com transparência, ética e um compromisso inabalável em realizar o seu sonho.
          </p>
        </div>

        {/* Container principal para os blocos de conteúdo */}
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Bloco: Sobre a Imobiliária */}
          <section className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl shadow-slate-200">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 border-l-4 border-lime-600 pl-4">
              A nossa história
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                    No mercado imobiliário há vários anos, a Joan Imóveis é, hoje, uma das imobiliárias mais consolidadas na região de Muriaé. 
                    Com transparência, ética e seriedade, a empresa conta com profissionais preparados que trabalham em parceria com o cliente, 
                    dando atendimento exclusivo, seja para compra, venda ou aluguel do seu imóvel.
                </p>
                <p>
                    A maior parte dos clientes da Joan Imóveis é fruto de indicações advindas de outros negócios já realizados por intermédio da empresa, 
                    conhecida pelo excelente pós-venda e alto trabalho consultivo. Desta forma, mais do que promover a concretização da compra, 
                    venda ou aluguel, a empresa presta consultoria completa durante todo o processo, 
                    buscando orientar, evitar transtornos e viabilizar o sonho do cliente.
                </p>
            </div>
          </section>

          {/* Grid para Endereço e Telefone */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bloco: Endereço */}
            <section className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200">
              <div className="flex items-start gap-4">
                  <div className="bg-lime-100 p-3 rounded-full mt-1 flex-shrink-0">
                      <MapPinIcon />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Endereço</h3>
                      <p className="text-slate-600 leading-relaxed">
                          RUA DOUTOR AFONSO CANEDO, Nº 23, Centro - Muriaé / MG - CEP: 36.500-000
                      </p>
                  </div>
              </div>
            </section>

            {/* Bloco: Telefone */}
            <section className="bg-white p-8 rounded-2xl shadow-2xl shadow-slate-200">
                <div className="flex items-start gap-4">
                    <div className="bg-lime-100 p-3 rounded-full mt-1 flex-shrink-0">
                        <PhoneCallIcon />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Telefone</h3>
                        <a href="tel:3237225927" className="text-slate-600 text-lg hover:text-lime-600 transition-colors">(32) 3722-5927</a>
                    </div>
                </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}

