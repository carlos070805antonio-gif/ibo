import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white text-slate-900 flex flex-col sm:items-center justify-between p-4 border-b border-slate-200">
      <nav className="flex gap-6 text-lg font-semibold">
        <Link href="/" className="hover:text-lime-700 transition-colors">Home</Link>
        <Link href="/sobrenos" className="hover:text-lime-700 transition-colors">Sobre Nós</Link>
        <Link href="/faleconosco" className="hover:text-lime-700 transition-colors">Fale Conosco</Link>
        <Link href="/simuladores" className="hover:text-lime-700 transition-colors">Simuladores</Link>
      </nav>
    </header>
  );
}
