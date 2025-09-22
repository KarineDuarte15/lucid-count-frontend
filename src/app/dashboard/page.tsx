// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { getEmpresas, getKpis, KpiData, Empresa } from '../../service/api';
import Header from '@/components/Header';
import KpiCard from '@/components/KpiCard';
import ImpostosChart from '@/components/ImpostosChart';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedCnpj, setSelectedCnpj] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const data = await getEmpresas();
        setEmpresas(data);
        if (data && data.length > 0) {
          setSelectedCnpj(data[0].cnpj);
        } else {
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
      setIsLoading(false);
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="bg-border flex-1 flex flex-col">
        <Header
          empresas={empresas}
          selectedCnpj={selectedCnpj}
          onCnpjChange={setSelectedCnpj}
          startDate={startDate}
          endDate={endDate}
          onDateChange={setDateRange}
        />
        <main className="bg-primary-card flex-1 p-8 overflow-y-auto">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard title="Faturamento Total" value={kpiData?.total_impostos_por_tipo?.FATURAMENTO_TOTAL ?? 'N/A'} isLoading={isLoading} />
            <KpiCard title="Carga Tributária" value={kpiData?.carga_tributaria_percentual?.Mes_Atual ?? null} isLoading={isLoading} />
            <KpiCard title="Ticket Médio" value={kpiData?.ticket_medio ?? null} isLoading={isLoading} />
            <KpiCard title="Crescimento da Receita" value={kpiData?.crescimento_faturamento_percentual ?? null} isLoading={isLoading} />
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-text-tertiary mb-4">Composição dos Impostos</h2>
              {error && !isLoading ? (
                <div className="text-red-400 text-center">{error}</div>
              ) : (
                <ImpostosChart data={kpiData?.total_impostos_por_tipo || null} isLoading={isLoading} />
              )}
            </section>
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-text-tertiary mb-4">Visão Geral</h2>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}