// app/api/imoveis/[id]/route.ts
import { NextResponse } from "next/server";
import { getImovelById, updateImovel, deleteImovel } from "../../../lib/imoveis";

// GET - Buscar imóvel por ID
export async function GET(
  request: Request,
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
    
    const imovel = getImovelById(numericId);
    
    if (!imovel) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ imovel }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imóvel" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar imóvel
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    const body = await req.json();
    
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    const imovelAtualizado = updateImovel(numericId, body);
    
    if (!imovelAtualizado) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        imovel: imovelAtualizado 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar imóvel" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar imóvel
export async function DELETE(
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
    
    const sucesso = deleteImovel(numericId);
    
    if (!sucesso) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: "Imóvel deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar imóvel:", error);
    return NextResponse.json(
      { error: "Erro ao deletar imóvel" },
      { status: 500 }
    );
  }
}