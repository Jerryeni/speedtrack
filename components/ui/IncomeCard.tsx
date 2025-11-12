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
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700 mb-3 sm:mb-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-${color}/20 flex items-center justify-center flex-shrink-0`}>
            <i className={`fas ${icon} text-${color} text-base sm:text-xl`}></i>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className={`font-semibold text-sm sm:text-base text-${color} truncate`}>{title}</h4>
            <p className="text-xs text-gray-400 hidden sm:block">{description}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className={`text-base sm:text-xl font-bold text-${color}`}>{amount}</p>
          <p className="text-xs text-green-400">{change}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <p className="text-xs text-gray-400 mb-1 truncate">{stat.label}</p>
            <p className={`text-sm sm:text-lg font-bold truncate ${index === 0 ? `text-${color}` : index === 1 ? 'text-green-400' : 'text-yellow-400'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-2 sm:mb-3">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-xs text-gray-400 truncate">{progressLabel}</span>
          <span className={`text-xs text-${color} ml-2`}>{progressValue}</span>
        </div>
        <div className="h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${progressPercent >= 80 ? 'racing-track' : `bg-${color} rounded-full`}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className={`text-xs text-${color} hover:text-neon-blue transition-colors min-h-[44px] flex items-center`}>
          {actionLabel}
        </button>
        {badgeIcon && badgeText && (
          <div className="flex items-center space-x-1 flex-shrink-0">
            <i className={`fas ${badgeIcon} text-${color} text-xs`}></i>
            <span className={`text-xs text-${color} hidden sm:inline`}>{badgeText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
