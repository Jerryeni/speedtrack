export default function IncomeProjections() {
  const projections = [
    {
      title: "Projected Daily",
      amount: "$178.50",
      icon: "fa-calendar-day",
      color: "neon-blue",
      badge: "Tomorrow",
      progress: 80,
      animation: "racing-track",
    },
    {
      title: "Projected Weekly",
      amount: "$1,249.50",
      icon: "fa-calendar-week",
      color: "electric-purple",
      badge: "Next Week",
      progress: 75,
      animation: "bg-electric-purple",
    },
    {
      title: "Projected Monthly",
      amount: "$5,234.80",
      icon: "fa-calendar-alt",
      color: "green-400",
      badge: "Next Month",
      progress: 80,
      animation: "bg-green-400 animate-[incomeWave_3s_ease-in-out_infinite]",
    },
    {
      title: "Monthly Growth",
      amount: "+22.5%",
      icon: "fa-chart-line",
      color: "yellow-400",
      badge: "Growth Rate",
      progress: 60,
      animation: "bg-yellow-400 animate-pulse-custom",
    },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Income Projections</h3>

      <div className="grid grid-cols-2 gap-4">
        {projections.map((projection, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${projection.color}/10 to-transparent rounded-2xl p-4 border border-${projection.color}/20`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-full bg-${projection.color}/20 flex items-center justify-center`}>
                <i className={`fas ${projection.icon} text-${projection.color}`}></i>
              </div>
              <div className={`text-xs bg-${projection.color}/20 text-${projection.color} px-2 py-1 rounded-full`}>
                {projection.badge}
              </div>
            </div>
            <p className={`text-xl font-bold text-${projection.color}`}>{projection.amount}</p>
            <p className="text-xs text-gray-400 mb-2">{projection.title}</p>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${projection.animation} rounded-full`}
                style={{ width: `${projection.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
