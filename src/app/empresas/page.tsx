// src/app/empresas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Empresa, getEmpresas } from '@/service/api';
import Sidebar from '@/components/Sidebar';
import { FaSpinner } from 'react-icons/fa';

// Estas importações agora devem funcionar se os arquivos estiverem no lugar certo
import EmpresaList from '@/components/EmpresaList';
import EmpresaDetail from '@/components/EmpresaDetail';

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        setIsLoading(true);
        const data = await getEmpresas();
        setEmpresas(data);
      } catch (err) {
        setError('Não foi possível carregar a lista de empresas.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmpresas();
  }, []);

  const handleBackToList = () => {
    setSelectedEmpresaId(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-border">
        <FaSpinner className="animate-spin text-accent text-4xl" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-primary-card">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-white text-gray-800 shadow-md">
          <h1 className="text-xl font-bold">Gestão de Empresas</h1>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          
          {selectedEmpresaId ? (
            <EmpresaDetail empresaId={selectedEmpresaId} onBack={handleBackToList} />
          ) : (
            <EmpresaList empresas={empresas} onSelectEmpresa={setSelectedEmpresaId} />
          )}
        </main>
      </div>
    </div>
  );
}