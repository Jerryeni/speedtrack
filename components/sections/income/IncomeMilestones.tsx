export default function IncomeMilestones() {
  const milestones = [
    {
      title: "First $1K Milestone",
      date: "Reached on March 15, 2024",
      icon: "fa-trophy",
      gradient: "from-green-400 to-emerald-500",
      status: "Achieved",
      statusColor: "green-400",
      progress: null,
    },
    {
      title: "$10K Income Club",
      date: "Reached on April 8, 2024",
      icon: "fa-star",
      gradient: "from-neon-blue to-electric-purple",
      status: "Achieved",
      statusColor: "neon-blue",
      progress: null,
    },
    {
      title: "$25K Elite Status",
      date: "$341 remaining",
      icon: "fa-crown",
      gradient: "",
      status: "In Progress",
      statusColor: "yellow-400",
      progress: 80,
      border: true,
    },
    {
      title: "$50K Diamond Tier",
      date: "Unlock at $25K milestone",
      icon: "fa-diamond",
      gradient: "",
      status: "Locked",
      statusColor: "gray-400",
      progress: null,
      locked: true,
    },
  ];

  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Achievement Milestones</h3>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full ${
                  milestone.gradient
                    ? `bg-gradient-to-r ${milestone.gradient}`
                    : milestone.border
                    ? "bg-gray-700 border-2 border-dashed border-yellow-400"
                    : "bg-gray-700 border-2 border-dashed border-gray-500"
                } flex items-center justify-center`}
              >
                <i
                  className={`fas ${milestone.icon} ${
                    milestone.gradient ? "text-white" : `text-${milestone.statusColor}`
                  }`}
                ></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-semibold text-${milestone.statusColor}`}>
                    {milestone.title}
                  </p>
                  <span
                    className={`text-xs bg-${milestone.statusColor}/20 text-${milestone.statusColor} px-2 py-1 rounded-full`}
                  >
                    {milestone.status}
                  </span>
                </div>
                <p className={`text-xs ${milestone.locked ? "text-gray-500" : "text-gray-400"}`}>
                  {milestone.date}
                </p>
                {milestone.progress && (
                  <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${milestone.statusColor} rounded-full animate-pulse-custom`}
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
