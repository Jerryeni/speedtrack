interface NetworkCardProps {
  name: string;
  gas: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

export default function NetworkCard({ name, gas, icon, iconColor, iconBg }: NetworkCardProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}>
            <i className={`${icon} ${iconColor}`}></i>
          </div>
          <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-gray-400">Gas: {gas}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-xs text-green-400">Active</span>
        </div>
      </div>
    </div>
  );
}
