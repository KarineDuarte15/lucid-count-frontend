// 1. A interface precisa saber da nova prop 'variant'.
// Ela é opcional ('?') e tem tipos definidos.
interface KpiCardProps {
  title: string;
  value: string | null;
  isLoading: boolean;
  variant?: 'border' | 'background' | 'accent' | 'default';
}

// 2. Este é o nosso "mapa de tradução" de variantes para classes de CSS.
const variantClasses = {
  border: 'bg-border',
  background: 'bg-background',
  accent: 'bg-accent',
  default: 'bg-gray-700', 
};

// 3. A função recebe a 'variant'. Se nenhuma for passada, 'border' será usado como padrão.
export default function KpiCard({ title, value, isLoading, variant = 'border' }: KpiCardProps) {
  
  // 4. AQUI ESTÁ O SEGREDO: Usamos a 'variant' recebida para escolher a classe CSS correta no mapa.
  // Por exemplo, se variant="accent", backgroundColor será "bg-accent".
  const backgroundColor = variantClasses[variant];

  return (
    // 5. AQUI A MÁGICA ACONTECE: Construímos a className final.
    // Usamos a variável `backgroundColor` para o fundo e `text-text-primary` para forçar o texto branco.
    <div className={`${backgroundColor} text-text-primary p-4 rounded-lg shadow-md flex-1`}>
      
      <h3 className="text-sm font-medium opacity-90">{title}</h3>

      {isLoading ? (
        <div className="h-8 bg-white/20 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold mt-1">{value || 'N/A'}</p>
      )}
    </div>
  );
}