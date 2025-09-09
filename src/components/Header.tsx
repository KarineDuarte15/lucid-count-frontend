// src/components/Header.tsx
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ProfileDropdown from './ProfileDropdown';
import Image from 'next/image';
import { FaBars } from 'react-icons/fa';

// ✅ CORREÇÃO 1: Definimos a mesma interface Empresa aqui
interface Empresa {
  id: number;
  cnpj: string;
  regime_tributario: string;
}

// ✅ CORREÇÃO 2: Atualizamos as props para esperar um array de objetos Empresa
interface HeaderProps {
  empresas: Empresa[];
  selectedCnpj: string;
  onCnpjChange: (cnpj: string) => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (dates: [Date | null, Date | null]) => void;
  onToggleSidebar: () => void;
}

export default function Header({
  empresas,
  selectedCnpj,
  onCnpjChange,
  startDate,
  endDate,
  onDateChange,
  onToggleSidebar
}: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-2 bg-background relative">
      <div className="flex items-center">
       <button 
          onClick={onToggleSidebar} 
          className="p-2 mr-2 text-text-primary hover:bg-primary-card rounded-md"
          aria-label="Abrir menu"
        >
          <FaBars className="h-6 w-6" />
        </button>
        <Image src="/login-background1.png" alt="Lucid Count Logo" width={160} height={160} />
        <h1 className="text-2xl font-bold text-text-primary ml-3">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={selectedCnpj}
          onChange={(e) => onCnpjChange(e.target.value)}
          className="bg-primary text-accent p-2 rounded-md border border-gray-600 focus:ring-accent focus:border-accent min-w-[220px]"
        >
          <option value="" disabled>Selecione um CNPJ</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.cnpj}>
              {empresa.cnpj}
            </option>
          ))}
        </select>

        <select className="bg-primary text-accent p-2 rounded-md border border-gray-600 focus:ring-accent focus:border-accent min-w-[220px]">
          <option value="" disabled>Selecione um regime</option>
          <option>Simples Nacional</option>
          <option>Lucro Presumido</option>
          <option>Lucro Real</option>
        </select>

        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={onDateChange}
          className="bg-primary text-accent p-2 rounded-md w-64 border border-gray-600 focus:ring-accent focus:border-accent"
          dateFormat="dd/MM/yyyy"
        />
        <ProfileDropdown />
      </div>
    </header>
  );
}