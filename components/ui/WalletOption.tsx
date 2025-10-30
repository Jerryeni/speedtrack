"use client";

interface WalletOptionProps {
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badges: { text: string; color: string }[];
  onClick: () => void;
}

export default function WalletOption({
  name,
  description,
  icon,
  iconBg,
  iconColor,
  badges,
  onClick,
}: WalletOptionProps) {
  return (
    <div
      className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 hover:border-neon-blue/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
            <i className={`${icon} ${iconColor} text-xl`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <i className="fas fa-chevron-right text-gray-400"></i>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`text-xs ${badge.color} px-2 py-1 rounded-full`}
          >
            {badge.text}
          </div>
        ))}
      </div>
    </div>
  );
}
