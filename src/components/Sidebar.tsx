// src/components/Sidebar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaUpload, FaDollarSign, FaChartBar, FaChartPie, FaPercentage, FaFileInvoice, FaRegFileArchive, FaTachometerAlt } from 'react-icons/fa';

const SidebarItem = ({ icon, text, href, isExpanded }: { icon: React.ElementType, text: string, href: string, isExpanded: boolean }) => {
  const Icon = icon;

  return (
    <Link href={href} className="flex items-center w-full px-4 py-3 text-left text-text-secondary hover:bg-primary hover:text-accent rounded-lg transition-colors duration-200">
      <Icon className="text-xl" />
      <span className={`ml-4 font-medium transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
        {text}
      </span>
    </Link>
  );
};

// O Sidebar agora controla seu próprio estado de "hover"
export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      className={`bg-background p-4 flex flex-col z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* INÍCIO DA ALTERAÇÃO: Logo agora é um link */}
      <div className="mb-4 flex justify-center">
        <Link href="/dashboard">
          <Image src="/logosidebar.png" alt="Lucid Count Logo" width={isExpanded ? 180 : 40} height={isExpanded ? 180 : 40} className="transition-all duration-300"/>
        </Link>
      </div>
      {/* FIM DA ALTERAÇÃO */}
      
      <nav className="flex flex-col gap-2 flex-1">
        <SidebarItem icon={FaUpload} text="Cadastrar Empresa" href="/cadastro-empresa" isExpanded={isExpanded} />
        <SidebarItem icon={FaRegFileArchive} text="Empresas" href="/empresas" isExpanded={isExpanded}/>
        <SidebarItem icon={FaDollarSign} text="Faturamento" href="#" isExpanded={isExpanded}/>
        <SidebarItem icon={FaChartBar} text="Área de KPIs" href="#" isExpanded={isExpanded}/>
        <SidebarItem icon={FaChartPie} text="Gráficos" href="#" isExpanded={isExpanded}/>
        <SidebarItem icon={FaPercentage} text="Impostos" href="#" isExpanded={isExpanded}/>
        <SidebarItem icon={FaFileInvoice} text="Gerar Relatório" href="#" isExpanded={isExpanded}/>
      </nav>
      
      {/* Botão para voltar ao Dashboard */}
      <div className="mt-auto">
        <SidebarItem icon={FaTachometerAlt} text="Voltar ao Dashboard" href="/dashboard" isExpanded={isExpanded}/>
      </div>
    </aside>
  );
}