'use client';

import { useEffect, useState } from 'react';
// A importação do CSS do DatePicker permanece a mesma
import "react-datepicker/dist/react-datepicker.css";

// As importações dos seus serviços e componentes permanecem as mesmas
import { getEmpresas, getKpis } from '../../service/api';
import Header from '@/components/Header';
import KpiCard from '@/components/KpiCard';
import ImpostosChart from '@/components/ImpostosChart';
import Sidebar from '@/components/Sidebar';
import ModalCadastroEmpresa from '@/components/ModalCadastroEmpresa';

// ✅ CORREÇÃO 1: Definimos uma interface para o objeto Empresa
// Isto diz ao nosso código qual é a "forma" dos dados que vêm da API.
interface Empresa {
  id: number;
  cnpj: string;
  regime_tributario: string;
}

// Interface KpiData (sem alterações)
interface KpiData {
  cnpj_consultado: string;
  carga_tributaria_percentual: string;
  ticket_medio: string;
  crescimento_faturamento_percentual: string;
  total_impostos_por_tipo: { [key: string]: string };
}

export default function DashboardPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedCnpj, setSelectedCnpj] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);

  const [startDate, endDate] = dateRange;

  // --- Efeitos para buscar dados (lógica ligeiramente ajustada) ---
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const data: Empresa[] = await getEmpresas();
        setEmpresas(data);
        // ✅ CORREÇÃO 3: Se houver empresas, selecionamos o CNPJ da primeira
        if (data && data.length > 0) {
          setSelectedCnpj(data[0].cnpj);
        } else {
          // Se não houver empresas, informamos o utilizador
          setError('Nenhuma empresa encontrada.');
        }
      } catch (e) {
        console.error("Erro ao buscar empresas:", e);
        setError('Falha ao carregar a lista de empresas.');
      }
    }
    
    fetchEmpresas();
    


  }, []);

  useEffect(() => {
    if (!selectedCnpj || !startDate || !endDate) {
      setIsLoading(false); // Garante que o loading para se os filtros não estiverem prontos
      return;
    }
    async function fetchKpis() {
      setIsLoading(true);
      setError(null);
      try {
        const data_inicio = startDate!.toISOString().split('T')[0];
        const data_fim = endDate!.toISOString().split('T')[0];
        const data = await getKpis(selectedCnpj, data_inicio, data_fim);
        setKpiData(data);
      } catch (e) {
        console.error("Erro ao buscar KPIs:", e);
        setError('Não foi possível carregar os dados para este período.');
        setKpiData(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchKpis();
  }, [selectedCnpj, startDate, endDate]);

  const handleEmpresaCadastrada = (novaEmpresa: Empresa) => {
    // Adiciona a nova empresa à lista existente
    setEmpresas(prevEmpresas => [...prevEmpresas, novaEmpresa]);
    // Seleciona automaticamente a empresa recém-cadastrada
    setSelectedCnpj(novaEmpresa.cnpj);
    // Fecha o modal
    setIsModalCadastroOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAbrirModalCadastro={() => setIsModalCadastroOpen(true)}
      />
      <ModalCadastroEmpresa
        isOpen={isModalCadastroOpen}
        onClose={() => setIsModalCadastroOpen(false)}
        onEmpresaCadastrada={handleEmpresaCadastrada}
      />
      <div className="bg-border flex-1 flex flex-col">
        {/* ✅ CORREÇÃO 4: Passamos a lista de objetos Empresa para o Header */}
        <Header
          empresas={empresas}
          selectedCnpj={selectedCnpj}
          onCnpjChange={setSelectedCnpj}
          startDate={startDate}
          endDate={endDate}
          onDateChange={setDateRange}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="bg-primary-card flex-1 p-8 overflow-y-auto">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard title="Faturamento Total" value={kpiData?.total_impostos_por_tipo?.FATURAMENTO_TOTAL ?? 'R$ 0,00'} isLoading={isLoading} />
            <KpiCard title="Carga Tributária" value={kpiData?.carga_tributaria_percentual ?? null} isLoading={isLoading} />
            <KpiCard title="Ticket Médio" value={kpiData?.ticket_medio ?? null} isLoading={isLoading} />
            <KpiCard title="Crescimento da Receita" value={kpiData?.crescimento_faturamento_percentual ?? null} isLoading={isLoading} />
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-text-secondary p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-text-tertiary mb-4">Composição dos Impostos</h2>
              {error && !isLoading ? ( // Mostra o erro apenas se não estiver a carregar
                <div className="text-red-400 text-center">{error}</div>
              ) : (
                <ImpostosChart data={kpiData?.total_impostos_por_tipo || null} isLoading={isLoading} />
              )}
            </section>
            <section className="bg-text-secondary p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-text-tertiary mb-4">Visão Geral</h2>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}