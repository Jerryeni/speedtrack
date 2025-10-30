export default function EarningsChart() {
  const levels = [
    { level: "L1", amount: 1247, height: "h-32" },
    { level: "L2", amount: 832, height: "h-24" },
    { level: "L3", amount: 456, height: "h-16" },
    { level: "L4", amount: 234, height: "h-12" },
    { level: "L5", amount: 156, height: "h-10" },
    { level: "L6", amount: 89, height: "h-8" },
    { level: "L7", amount: 67, height: "h-6" },
    { level: "L8", amount: 45, height: "h-5" },
    { level: "L9", amount: 23, height: "h-4" },
    { level: "L10", amount: 12, height: "h-3" },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Earnings by Level</h3>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="h-64 flex items-end justify-around space-x-2">
          {levels.map((level, index) => (
            <div key={level.level} className="flex-1 flex flex-col items-center space-y-2">
              <div className="text-xs text-gray-400">${level.amount}</div>
              <div
                className={`w-full ${level.height} bg-gradient-to-t from-neon-blue via-electric-purple to-neon-blue rounded-t-lg transition-all hover:opacity-80`}
                style={{ animationDelay: `${index * 0.1}s` }}
              ></div>
              <div className="text-xs text-gray-400">{level.level}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-neon-blue">$1,247</p>
            <p className="text-xs text-gray-400">Level 1-3</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-electric-purple">$892</p>
            <p className="text-xs text-gray-400">Level 4-6</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">$708</p>
            <p className="text-xs text-gray-400">Level 7-10</p>
          </div>
        </div>
      </div>
    </section>
  );
}
