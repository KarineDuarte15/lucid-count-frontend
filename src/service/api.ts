// src/service/api.ts
import axios from 'axios';

// --- Interfaces ---

export interface Empresa {
  id: number;
  cnpj: string;
  regime_tributario: string;
}

export interface Documento {
  id: number;
  empresa_id: number;
  tipo_documento: string;
  nome_arquivo_original: string;
  nome_arquivo_unico: string;
  data_upload: string;
}

export interface RespostaProcessamento {
  documento_id: number;
  tipo_documento: string;
  dados_extraidos: Record<string, unknown>; 
}

export interface DocumentosExigidos {
  [regime: string]: string[];
}


// --- Funções da API ---

const apiClient = axios.create({
   baseURL: 'http://localhost:8000',
});
export default apiClient;

export const getEmpresas = async (): Promise<Empresa[]> => { 
  try {
    const response = await apiClient.get<Empresa[]>('/empresas/');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    throw error;
  }
};

export const getKpis = async (cnpj: string, data_inicio: string, data_fim: string) => {
  try {
    const regime = "Simples Nacional"; // Ajuste conforme necessário
    const response = await apiClient.get('/analytics/kpis', {
      params: { cnpj, regime, data_inicio, data_fim }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar KPIs:", error);
    throw error;
  }
};

// Suas outras funções (login, getEmpresas, etc.) devem estar aqui
export const getDocumentos = async (): Promise<Documento[]> => {
  try {
    const response = await apiClient.get<Documento[]>('/documentos/');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    throw error;
  }
};

export const processarDocumento = async (documentoId: number): Promise<RespostaProcessamento> => {
  try {
    const response = await apiClient.post<RespostaProcessamento>(`/documentos/${documentoId}/processar`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao processar documento ${documentoId}:`, error);
    throw error;
  }
};


export const getDocumentosExigidos = async (): Promise<DocumentosExigidos> => {
    try {
        const response = await apiClient.get<DocumentosExigidos>('/upload-options/');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar opções de upload:", error);
        throw error;
    }
};

export const salvarDadosDocumento = async (documentoId: number, dados: Record<string, unknown>) => {
    try {
        const response = await apiClient.put(`/documentos/${documentoId}/dados`, dados);
        return response.data;
    } catch (error) {
        console.error(`Erro ao salvar dados do documento ${documentoId}:`, error);
        throw error;
    }
};

export const criarEmpresa = async (cnpj: string, regime: string, documentos_ids: number[]): Promise<Empresa> => {
  try {
    const response = await apiClient.post<Empresa>('/empresas/', {
      cnpj,
      regime,
      documentos_ids: documentos_ids,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    throw error;
  }
};