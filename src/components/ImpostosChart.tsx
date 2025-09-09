// src/components/ImpostosChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: { [key: string]: string} | null;
  isLoading: boolean;
}

export default function ImpostosChart({ data, isLoading }: ChartProps) {
  if (isLoading) {
    return <div className="w-full h-80 bg-primary rounded-lg animate-pulse"></div>;
  }
  
  if (!data) {
    return <div className="w-full h-80 bg-primary rounded-lg flex items-center justify-center text-red-500">Sem dados para exibir.</div>;
  }

  // Transforma o objeto de impostos num array que o Recharts entende
  const chartData = Object.entries(data)
    .filter(([key]) => !['VALOR_TOTAL', 'QTD_NFSE_EMITIDAS', 'FATURAMENTO_TOTAL'].includes(key))
    .map(([name, value]) => ({
      name,
      // Converte o valor formatado 'R$ 1.234,56' para um número
      valor: parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.'))
    }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" stroke="#CCD6F6" />
        <YAxis stroke="#CCD6F6" />
        <Tooltip
          cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
          contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #0A192F' }}
        />
        <Legend />
        <Bar dataKey="valor" name="Valor (R$)" fill="#0A192F" />
      </BarChart>
    </ResponsiveContainer>
  );
}