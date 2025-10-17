// app/api/imoveis/route.ts
import { NextResponse } from "next/server";
import { getImoveis, addImovel, filterImoveis } from "../../lib/imoveis";

// GET - Listar imóveis (com filtros opcionais)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extrair filtros da query string
    const filters = {
      transacao: searchParams.get("transacao") || undefined,
      tipo: searchParams.get("tipo") || undefined,
      cidade: searchParams.get("cidade") || undefined,
      bairro: searchParams.get("bairro") || undefined,
      quartos: searchParams.get("quartos") || undefined,
      precoMin: searchParams.get("precoMin") 
        ? Number(searchParams.get("precoMin")) 
        : undefined,
      precoMax: searchParams.get("precoMax") 
        ? Number(searchParams.get("precoMax")) 
        : undefined,
    };
    
    // Se não tem filtros, retorna todos
    const hasFilters = Object.values(filters).some(v => v !== undefined);
    const imoveis = hasFilters ? filterImoveis(filters) : getImoveis();
    
    return NextResponse.json({ imoveis }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóveis" },
      { status: 500 }
    );
  }
}

// POST - Criar novo imóvel
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      tipo, 
      transacao, 
      cidade, 
      bairro, 
      rua,
      quartos, 
      banheiro, 
      vagas_garagem, 
      codigo, 
      preco, 
      descricao, 
      images 
    } = body;
    
    // Validação básica
    if (!tipo || !transacao || !cidade || !bairro || !quartos || !preco) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }
    
    const novoImovel = addImovel({
      tipo,
      transacao,
      cidade,
      bairro,
      rua: rua || "",
      quartos: Number(quartos),
      banheiro: Number(banheiro) || 0,
      vagas_garagem: Number(vagas_garagem) || 0,
      codigo: codigo || "",
      preco: Number(preco),
      descricao: descricao || "",
      images: images || [],
    });
    
    return NextResponse.json(
      { 
        success: true, 
        imovel: novoImovel 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao criar imóvel" },
      { status: 500 }
    );
  }
}