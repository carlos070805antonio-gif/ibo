import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ToasterProvider } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Imobiliária Ideal",
  description: "Seu imóvel dos sonhos está aqui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <ToasterProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-10">
            {children}
          </main>
          <Footer />
        </ToasterProvider>

      </body>
    </html>
  );
}
