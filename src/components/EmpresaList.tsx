// src/components/EmpresaList.tsx
'use client';

import { Empresa } from '@/service/api';
import { FaPlus } from 'react-icons/fa'; // Corrigido: FaSearch removido
import Link from 'next/link';

interface EmpresaListProps {
  empresas: Empresa[];
  onSelectEmpresa: (id: number) => void;
}

export default function EmpresaList({ empresas, onSelectEmpresa }: EmpresaListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Empresas Cadastradas</h2>
        <Link href="/cadastro-empresa" className="flex items-center bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
          <FaPlus className="mr-2" />
          Nova Empresa
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razão Social / Nome Fantasia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regime Tributário</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empresas.map((empresa) => (
              <tr key={empresa.id} onClick={() => onSelectEmpresa(empresa.id)} className="hover:bg-gray-100 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{empresa.razao_social || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{empresa.nome_fantasia || ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.cnpj}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.regime_tributario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}