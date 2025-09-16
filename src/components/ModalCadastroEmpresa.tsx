// src/components/ModalCadastroEmpresa.tsx
'use client';

import { useState } from 'react';
import { criarEmpresa, EmpresaData } from '../service/api'; // Importa a função da API
import { FaTimes } from 'react-icons/fa';
import axios from 'axios'; 


// A interface Empresa que já usamos em outros lugares
interface Empresa {
  id: number;
  cnpj: string;
  regime_tributario: string;
}

// Props do nosso modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Função para ser chamada quando uma empresa for cadastrada com sucesso
  onEmpresaCadastrada: (novaEmpresa: Empresa) => void; 
}

export default function ModalCadastroEmpresa({ isOpen, onClose, onEmpresaCadastrada }: ModalProps) {
  const [cnpj, setCnpj] = useState('');
  const [regime, setRegime] = useState('Simples Nacional'); // Valor inicial padrão
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validação simples
    if (!cnpj || !regime) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try{
      // ✅ CORREÇÃO 1: Construir o objeto de dados da empresa
      const empresaParaCriar: EmpresaData = {
        cnpj: cnpj,
        regime_tributario: regime,
        ativa: true, // Adiciona um valor padrão
      };

      // ✅ CORREÇÃO 2: Chamar a API com o objeto correto
      const novaEmpresa = await criarEmpresa(empresaParaCriar);

      alert('Empresa cadastrada com sucesso!');

      // ✅ CORREÇÃO 3: Usar a prop e a variável, resolvendo os erros de "unused vars"
      onEmpresaCadastrada(novaEmpresa); 
      
      onClose();
      setCnpj('');
      setRegime('Simples Nacional');

    } catch (err) { // ✅ CORREÇÃO 4: Tratamento de erro sem o tipo "any"
      console.error(err);
      let errorDetail = "Ocorreu um erro inesperado ao finalizar o cadastro.";

      if (axios.isAxiosError(err) && err.response && err.response.data?.detail) {
        const responseDetail = err.response.data.detail;
        if (Array.isArray(responseDetail)) {
          const firstError = responseDetail[0];
          const campo = firstError.loc[1] || 'desconhecido';
          const msg = firstError.msg || 'valor inválido';
          errorDetail = `Erro de Validação: ${msg} (no campo: ${campo})`;
        } else {
          errorDetail = responseDetail;
        }
      }
      
      setError(errorDetail);

    } finally {
       setIsLoading(false);
    }
  };

  if (!isOpen) return null;


  return (
    // Overlay (fundo escuro)
    <div className="fixed inset-0 bg-background bg-opacity-70 z-50 flex items-center justify-center">
      {/* Conteúdo do Modal */}
      <div className="bg-text-secondary p-8 rounded-lg shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-accent">
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-background text-center mb-6">Cadastrar Nova Empresa</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 bg-red-900/20 border border-red-400 rounded p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-text-secondary mb-1">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
              required
              className="w-full p-2 border border-gray-600 rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="regime" className="block text-sm font-medium text-text-secondary mb-1">
              Regime Tributário
            </label>
            <select
              id="regime"
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              required
              className="w-full p-2 border border-gray-600 rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {/* As opções vêm da sua documentação da API */}
              <option>Simples Nacional</option>
              <option>Lucro Presumido (Comércio/Indústria ou Comércio/Indústria e Serviços)</option>
              <option>Lucro Presumido (Serviços)</option>
              <option>Lucro Real (Comércio/Indústria ou Comércio/Indústria e Serviços)</option>
              <option>Lucro Real (Serviços)</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 mr-2 bg-gray-600 text-text-primary font-semibold rounded-md hover:bg-gray-500 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-accent text-background font-semibold rounded-md hover:bg-yellow-500 transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}