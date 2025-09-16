// src/service/api.ts
import axios from 'axios';

// --- Interfaces ---
export interface Endereco {
  logradouro?: string; numero?: string; complemento?: string; cep?: string; bairro?: string; cidade?: string; uf?: string;
}
export interface InscricaoEstadual {
  inscricao: string; data: string; uf: string;
}
export interface Contato {
  nome: string; cargo: string; celular: string; email: string;
}
export interface EmpresaData {
  cnpj: string; regime_tributario: string; razao_social?: string; nome_fantasia?: string; ativa: boolean;
  endereco?: Endereco; fones?: string[]; website?: string; inscricao_municipal?: string;
  inscricoes_estaduais?: InscricaoEstadual[]; nire?: string; outros_identificadores?: string[];
  grupo_empresas?: string; apelido_continuo?: string; contatos?: Contato[];
  [key: string]: unknown;
}
export interface Empresa extends EmpresaData {
  id: number;
}
export interface Documento {
  id: number; empresa_id: number; tipo_documento: string; nome_arquivo_original: string;
  nome_arquivo_unico: string; data_upload: string;
}
export interface DocumentosExigidos {
  [regime: string]: string[];
}
// ADICIONADO DE VOLTA: Interface para os KPIs
export interface KpiData {
  cnpj_consultado: string;
  carga_tributaria_percentual: { [key: string]: string } | null;
  ticket_medio: string | null;
  crescimento_faturamento_percentual: string | null;
  total_impostos_por_tipo: { [key: string]: string };
}

// --- Configuração da API ---
const apiClient = axios.create({
   baseURL: 'http://localhost:8000',
});

// --- Funções da API ---
export const getEmpresas = async (): Promise<Empresa[]> => { 
  try {
    const response = await apiClient.get<Empresa[]>('/empresas/');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    throw error;
  }
};

// ADICIONADO DE VOLTA: A função getKpis que estava em falta
export const getKpis = async (cnpj: string, data_inicio: string, data_fim: string): Promise<KpiData> => {
  try {
    const regime = "Simples Nacional";
    const response = await apiClient.get('/analytics/kpis', {
      params: { cnpj, regime, data_inicio, data_fim }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar KPIs:", error);
    throw error;
  }
};

export const getUploadOptions = async (): Promise<DocumentosExigidos> => {
    try {
        const response = await apiClient.get<DocumentosExigidos>('/upload-options/');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar opções de upload:", error);
        throw error;
    }
};

export const criarEmpresa = async (empresaData: EmpresaData): Promise<Empresa> => {
  try {
    const response = await apiClient.post<Empresa>('/empresas/', empresaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    throw error;
  }
};

export const uploadDocumentos = async (
  cnpj: string, 
  regime: string, 
  documentos: { tipo: string; arquivo: File }[]
): Promise<Documento[]> => {
  const arquivosPorTipo: { [key: string]: File[] } = {};
  documentos.forEach(doc => {
    if (doc.arquivo) {
      if (!arquivosPorTipo[doc.tipo]) arquivosPorTipo[doc.tipo] = [];
      arquivosPorTipo[doc.tipo].push(doc.arquivo);
    }
  });
  const promessasDeUpload: Promise<Documento[]>[] = [];
  for (const tipo in arquivosPorTipo) {
    const formData = new FormData();
    formData.append('cnpj', cnpj);
    formData.append('regime', regime);
    formData.append('tipo_documento', tipo);
    arquivosPorTipo[tipo].forEach(file => formData.append('files', file, file.name));
    const promessa = apiClient.post<Documento[]>('/upload/files/', formData)
      .then(res => res.data);  // .then() extrai os dados da resposta
    promessasDeUpload.push(promessa);
  }
  const resultadosUpload = await Promise.all(promessasDeUpload);
  return resultadosUpload.flat();
};

export default apiClient;