interface NetworkCardProps {
  name: string;
  gas: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  active?: boolean;
  recommended?: boolean;
}

export default function NetworkCard({ 
  name, 
  gas, 
  icon, 
  iconColor, 
  iconBg,
  active = false,
  recommended = false
}: NetworkCardProps) {
  return (
    <div className={`bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 border ${active ? 'border-neon-blue' : 'border-gray-700'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}>
            <i className={`${icon} ${iconColor}`}></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-sm">{name}</p>
              {recommended && (
                <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">Gas: {gas}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-400' : 'bg-gray-600'}`}></div>
          <span className={`text-xs ${active ? 'text-green-400' : 'text-gray-500'}`}>
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
