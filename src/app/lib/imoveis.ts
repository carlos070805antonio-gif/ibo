// lib/imoveis.ts
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'imoveis.json');

export interface Imovel {
  id: number;
  tipo: string;
  transacao: string;
  cidade: string;
  bairro: string;
  rua: string,
  quartos: number;
  banheiro: number;
  vagas_garagem: number;
  codigo: string;
  preco: number;
  descricao?: string;
  images?: string[];
  visualizacoes: number;
  ordem: number;
  createdAt: string;
}

interface DataStore {
  imoveis: Imovel[];
}

// Inicializar arquivo se não existir
function initDataFile(): void {
  // Criar pasta data se não existir
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Pasta data/ criada');
  }
  
  // Criar arquivo imoveis.json se não existir
  if (!fs.existsSync(dataFilePath)) {
    const initialData: DataStore = { imoveis: [] };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
    console.log('📄 Arquivo imoveis.json criado');
  }
}

// Ler todos os imóveis
export function getImoveis(): Imovel[] {
  try {
    initDataFile(); // Garante que arquivo existe
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const data: DataStore = JSON.parse(fileData);
    return data.imoveis;
  } catch (error) {
    console.error('Erro ao ler imóveis:', error);
    return [];
  }
}

// Buscar imóvel por ID
export function getImovelById(id: number): Imovel | null {
  const imoveis = getImoveis();
  return imoveis.find(imovel => imovel.id === id) || null;
}

// Adicionar novo imóvel
export function addImovel(imovelData: Omit<Imovel, 'id' | 'createdAt' | 'visualizacoes' | 'ordem'>): Imovel {
  const imoveis = getImoveis();
  
  // Gerar novo ID
  const newId = imoveis.length > 0 
    ? Math.max(...imoveis.map(i => i.id)) + 1 
    : 1;
  
  // Gerar código automático se não fornecido
  const codigo = imovelData.codigo || `IM${String(newId).padStart(4, '0')}`;
  
  const novoImovel: Imovel = {
    ...imovelData,
    id: newId,
    codigo,
    visualizacoes: 0,
    ordem: imoveis.length,
    createdAt: new Date().toISOString(),
  };
  
  imoveis.push(novoImovel);
  
  // Salvar no arquivo
  saveImoveis(imoveis);
  
  return novoImovel;
}

// Atualizar imóvel
export function updateImovel(id: number, imovelData: Partial<Imovel>): Imovel | null {
  const imoveis = getImoveis();
  const index = imoveis.findIndex(i => i.id === id);
  
  if (index === -1) return null;
  
  imoveis[index] = { ...imoveis[index], ...imovelData };
  saveImoveis(imoveis);
  
  return imoveis[index];
}

// Deletar imóvel
export function deleteImovel(id: number): boolean {
  const imoveis = getImoveis();
  const filteredImoveis = imoveis.filter(i => i.id !== id);
  
  if (filteredImoveis.length === imoveis.length) return false;
  
  saveImoveis(filteredImoveis);
  return true;
}

// Filtrar imóveis
export function filterImoveis(filters: {
  transacao?: string;
  tipo?: string;
  cidade?: string;
  bairro?: string;
  quartos?: string;
  precoMin?: number;
  precoMax?: number;
}): Imovel[] {
  let imoveis = getImoveis();
  
  if (filters.transacao) {
    imoveis = imoveis.filter(i => i.transacao === filters.transacao);
  }
  
  if (filters.tipo) {
    imoveis = imoveis.filter(i => i.tipo === filters.tipo);
  }
  
  if (filters.cidade) {
    imoveis = imoveis.filter(i => 
      i.cidade.toLowerCase().includes(filters.cidade!.toLowerCase())
    );
  }
  
  if (filters.bairro) {
    imoveis = imoveis.filter(i => 
      i.bairro.toLowerCase().includes(filters.bairro!.toLowerCase())
    );
  }
  
  if (filters.quartos) {
    if (filters.quartos === '5+') {
      imoveis = imoveis.filter(i => i.quartos >= 5);
    } else {
      imoveis = imoveis.filter(i => i.quartos === Number(filters.quartos));
    }
  }
  
  if (filters.precoMin) {
    imoveis = imoveis.filter(i => i.preco >= filters.precoMin!);
  }
  
  if (filters.precoMax) {
    imoveis = imoveis.filter(i => i.preco <= filters.precoMax!);
  }
  
  return imoveis;
}

// Salvar imóveis no arquivo
function saveImoveis(imoveis: Imovel[]): void {
  initDataFile(); // Garante que pasta e arquivo existem
  const data: DataStore = { imoveis };
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Incrementar visualizações
export function incrementarVisualizacoes(id: number): boolean {
  const imoveis = getImoveis();
  const imovel = imoveis.find(i => i.id === id);
  
  if (!imovel) return false;
  
  imovel.visualizacoes = (imovel.visualizacoes || 0) + 1;
  saveImoveis(imoveis);
  
  return true;
}

// Atualizar ordem dos imóveis
export function atualizarOrdem(ordensNovas: { id: number; ordem: number }[]): boolean {
  try {
    const imoveis = getImoveis();
    
    ordensNovas.forEach(({ id, ordem }) => {
      const imovel = imoveis.find(i => i.id === id);
      if (imovel) {
        imovel.ordem = ordem;
      }
    });
    
    saveImoveis(imoveis);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error);
    return false;
  }
}


