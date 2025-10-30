export default function IncomeAnalytics() {
  const weekDays = [
    { day: "Mon", height: "75%" },
    { day: "Tue", height: "80%" },
    { day: "Wed", height: "66%" },
    { day: "Thu", height: "100%" },
    { day: "Fri", height: "60%" },
    { day: "Sat", height: "50%" },
    { day: "Sun", height: "80%" },
  ];

  const colors = [
    "neon-blue/30",
    "electric-purple/30",
    "green-400/30",
    "yellow-400/30",
    "neon-blue/30",
    "electric-purple/30",
    "green-400/30",
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Income Analytics</h3>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Weekly Performance</h4>
          <div className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">
            +18.5%
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="h-16 bg-gray-800 rounded-lg mb-2 relative overflow-hidden">
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-${colors[index]} rounded-lg ${
                    index === 3 ? "animate-pulse-custom" : ""
                  }`}
                  style={{ height: day.height }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">{day.day}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-neon-blue">$1,098</p>
            <p className="text-xs text-gray-400">Week Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-electric-purple">$156</p>
            <p className="text-xs text-gray-400">Daily Avg</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-400">Thu</p>
            <p className="text-xs text-gray-400">Best Day</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-yellow-400">+18%</p>
            <p className="text-xs text-gray-400">Growth</p>
          </div>
        </div>
      </div>
    </section>
  );
}
