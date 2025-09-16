// src/components/Sidebar.tsx
import Image from 'next/image';
import Link from 'next/link'; // <-- ADICIONADO: Importação do Link
import { FaUpload, FaDollarSign, FaChartBar, FaChartPie, FaPercentage, FaFileInvoice, FaRegFileArchive } from 'react-icons/fa';

// O componente SidebarItem agora pode ser um Link ou um button
const SidebarItem = ({ icon, text, href, onClick }: { icon: React.ElementType, text: string, href?: string, onClick?: () => void }) => {
  const Icon = icon;
  
  const content = (
    <>
      <Icon className="mr-4 text-xl" />
      <span className="font-medium">{text}</span>
    </>
  );

  const className = "flex items-center w-full px-4 py-3 text-left text-text-secondary hover:bg-primary hover:text-accent rounded-lg transition-colors duration-200";

  if (href) {
    return <Link href={href} className={className}>{content}</Link>;
  }

  return <button onClick={onClick} className={className}>{content}</button>;
};


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // A prop onAbrirModalCadastro não é mais necessária
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-primary bg-opacity-30 z-40 transition-opacity duration-300 ${ isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <aside className={`fixed top-0 left-0 h-full w-64 bg-background p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${ isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-4 flex justify-center">
          <Image src="/logosidebar.png" alt="Lucid Count Logo" width={180} height={180}/>
        </div>
        <nav className="flex flex-col gap-2">
          <SidebarItem icon={FaUpload} text="Cadastrar Empresa" href="/cadastro-empresa" />
          <SidebarItem icon={FaRegFileArchive} text="Empresa" />
          <SidebarItem icon={FaDollarSign} text="Faturamento" />
          <SidebarItem icon={FaChartBar} text="Área de KPIs" />
          <SidebarItem icon={FaChartPie} text="Gráficos" />
          <SidebarItem icon={FaPercentage} text="Impostos" />
          <SidebarItem icon={FaFileInvoice} text="Gerar Relatório" />
        </nav>
      </aside>
    </>
  );
}