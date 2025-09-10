// src/components/Sidebar.tsx
import { FaUpload, FaDollarSign, FaChartBar, FaChartPie, FaPercentage, FaFileInvoice, FaRegFileArchive } from 'react-icons/fa';

// Componente SidebarItem (sem alterações)
const SidebarItem = ({ icon, text, onClick }: { icon: React.ElementType, text: string, onClick?: () => void }) => {
  const Icon = icon;
  return (
    // O erro "Você quis dizer 'onclick'?" é um falso positivo do editor. A escrita correta em React é 'onClick'.
    <button 
      onClick={onClick}
      className="flex items-center w-full px-4 py-3 text-left text-text-secondary hover:bg-primary hover:text-accent rounded-lg transition-colors duration-200"
    >
      <Icon className="mr-4 text-xl" />
      <span className="font-medium">{text}</span>
    </button>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAbrirModalCadastro: () => void;
}

export default function Sidebar({ isOpen, onClose, onAbrirModalCadastro }: SidebarProps) {
  return (
    <>
      {/* Overlay: um fundo escuro que aparece atrás do menu para dar foco */}
      <div
        onClick={onClose}
        // As classes agora controlam a opacidade geral do elemento.
        // Ele começa com opacidade 0 e não interativo.
        // Quando 'isOpen', torna-se visível (opacidade 100).
        className={`fixed inset-0 bg-primary bg-opacity-30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* O conteúdo da Sidebar */}
     <aside
        // A lógica de translação permanece, garantindo a animação de deslize.
        // O z-index 50 garante que ela fique na frente de tudo.
        className={`fixed top-0 left-0 h-full w-64 bg-background p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary-card text-center">Menu</h2>
        </div>
        <nav className="flex flex-col gap-2">
          <SidebarItem icon={FaUpload} text="Cadastrar Empresa" onClick={onAbrirModalCadastro} />
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