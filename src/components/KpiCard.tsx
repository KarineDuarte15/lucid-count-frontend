// src/components/KpiCard.tsx
interface KpiCardProps {
  title: string;
  value: string | null;
  isLoading: boolean;
}

export default function KpiCard({ title, value, isLoading }: KpiCardProps) {
  return (
    <div className="bg-primary p-4 rounded-lg shadow-md flex-1">
      <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
      {isLoading ? (
        <div className="h-8 bg-gray-700 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-accent mt-1">{value || 'N/A'}</p>
      )}
    </div>
  );
}