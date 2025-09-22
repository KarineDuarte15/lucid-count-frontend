// src/components/EmpresaDetail.tsx
'use client';

import { FaArrowLeft } from 'react-icons/fa';

interface EmpresaDetailProps {
  empresaId: number;
  onBack: () => void;
}

export default function EmpresaDetail({ empresaId, onBack }: EmpresaDetailProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
      <button onClick={onBack} className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
        <FaArrowLeft className="mr-2" />
        Voltar para a lista
      </button>

      <h2 className="text-xl font-bold mb-4">Detalhes da Empresa (ID: {empresaId})</h2>

      {/* AQUI ENTRARÁ O FORMULÁRIO DE EDIÇÃO E A SEÇÃO DE UPLOAD */}
      <p>Em breve: formulário para editar os dados e seção para visualizar e adicionar novos documentos.</p>
    </div>
  );
}