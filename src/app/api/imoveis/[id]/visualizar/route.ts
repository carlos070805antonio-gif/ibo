// app/api/imoveis/[id]/visualizar/route.ts
import { NextResponse } from "next/server";
import { incrementarVisualizacoes } from "../../../../lib/imoveis";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    const sucesso = incrementarVisualizacoes(numericId);
    
    if (!sucesso) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao incrementar visualização:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}