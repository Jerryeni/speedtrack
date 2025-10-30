interface StatCardProps {
  value: string;
  label: string;
  color: string;
  progress?: number;
  id?: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  gradient?: string;
  border?: string;
  layout?: "center" | "box";
}

export default function StatCard({ 
  value, 
  label, 
  color, 
  progress = 75, 
  id,
  icon,
  badge,
  badgeColor,
  gradient,
  border,
  layout = "center"
}: StatCardProps) {
  if (layout === "box") {
    return (
      <div className={`bg-gradient-to-br ${gradient} to-transparent rounded-2xl p-4 border ${border}`}>
        {icon && badge && (
          <div className="flex items-center justify-between mb-2">
            <i className={`fas ${icon} ${color}`}></i>
            <div className={`text-xs ${badgeColor} px-2 py-1 rounded-full`}>
              {badge}
            </div>
          </div>
        )}
        <p className={`text-2xl font-bold ${color}`} id={id}>{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
        <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${progress === 100 ? 'bg-green-400' : 'racing-track'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className={`text-2xl font-orbitron font-bold ${color}`} id={id}>
        {value}
      </div>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
      <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${progress === 100 ? 'bg-green-400' : 'racing-track'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
