export default function RecentActivity() {
  const activities = [
    {
      name: "Alex Johnson",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      action: "Joined via your link",
      amount: "+$15",
      time: "2 min ago",
      level: "Level 1",
      status: "Active",
      levelColor: "neon-blue",
      statusColor: "green-400",
    },
    {
      name: "Sarah Chen",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      action: "Made first investment",
      amount: "+$25",
      time: "15 min ago",
      level: "Level 2",
      status: "Investing",
      levelColor: "electric-purple",
      statusColor: "yellow-400",
    },
    {
      name: "Mike Rodriguez",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
      action: "Reached Level 5 team",
      amount: "+$45",
      time: "1 hour ago",
      level: "Level 1",
      status: "Team Leader",
      levelColor: "green-400",
      statusColor: "purple-400",
    },
    {
      name: "Emma Wilson",
      avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
      action: "Commission earned",
      amount: "+$12",
      time: "2 hours ago",
      level: "Level 3",
      status: "Regular",
      levelColor: "neon-blue",
      statusColor: "blue-400",
    },
  ];

  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold">Recent Activity</h3>
        <button className="text-neon-blue text-sm font-medium">View All</button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-3 border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activity.avatar}
                  alt={activity.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-xs text-gray-400">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-400">{activity.amount}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className={`text-xs bg-${activity.levelColor}/20 text-${activity.levelColor} px-2 py-1 rounded-full`}>
                {activity.level}
              </div>
              <div className={`text-xs bg-${activity.statusColor}/20 text-${activity.statusColor} px-2 py-1 rounded-full`}>
                {activity.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
