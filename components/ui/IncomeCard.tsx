interface IncomeCardProps {
  title: string;
  description: string;
  amount: string;
  change: string;
  icon: string;
  color: string;
  stats: { label: string; value: string }[];
  progressLabel: string;
  progressValue: string;
  progressPercent: number;
  actionLabel: string;
  badgeIcon?: string;
  badgeText?: string;
}

export default function IncomeCard({
  title,
  description,
  amount,
  change,
  icon,
  color,
  stats,
  progressLabel,
  progressValue,
  progressPercent,
  actionLabel,
  badgeIcon,
  badgeText,
}: IncomeCardProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-${color}/20 flex items-center justify-center`}>
            <i className={`fas ${icon} text-${color} text-xl`}></i>
          </div>
          <div>
            <h4 className={`font-semibold text-${color}`}>{title}</h4>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold text-${color}`}>{amount}</p>
          <p className="text-xs text-green-400">{change}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-lg font-bold ${index === 0 ? `text-${color}` : index === 1 ? 'text-green-400' : 'text-yellow-400'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">{progressLabel}</span>
          <span className={`text-xs text-${color}`}>{progressValue}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressPercent >= 80 ? 'racing-track' : `bg-${color} rounded-full`}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className={`text-xs text-${color} hover:text-neon-blue transition-colors`}>
          {actionLabel}
        </button>
        {badgeIcon && badgeText && (
          <div className="flex items-center space-x-1">
            <i className={`fas ${badgeIcon} text-${color} text-xs`}></i>
            <span className={`text-xs text-${color}`}>{badgeText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
