interface TransactionCardProps {
  type: "reward" | "reinvest" | "entry";
  title: string;
  time: string;
  amount: string;
  usdValue: string;
  txHash: string;
}

export default function TransactionCard({ 
  type, 
  title, 
  time, 
  amount, 
  usdValue, 
  txHash 
}: TransactionCardProps) {
  const config = {
    reward: {
      gradient: "from-green-500/10",
      border: "border-green-500/20",
      iconBg: "bg-green-500/20",
      icon: "fa-arrow-down",
      iconColor: "text-green-400",
      amountColor: "text-green-400",
    },
    reinvest: {
      gradient: "from-neon-blue/10",
      border: "border-neon-blue/20",
      iconBg: "bg-neon-blue/20",
      icon: "fa-recycle",
      iconColor: "text-neon-blue",
      amountColor: "text-neon-blue",
    },
    entry: {
      gradient: "from-electric-purple/10",
      border: "border-electric-purple/20",
      iconBg: "bg-electric-purple/20",
      icon: "fa-plus",
      iconColor: "text-electric-purple",
      amountColor: "text-electric-purple",
    },
  };

  const styles = config[type];

  return (
    <div className={`bg-gradient-to-r ${styles.gradient} to-transparent rounded-xl p-4 border ${styles.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center`}>
            <i className={`fas ${styles.icon} ${styles.iconColor} text-sm`}></i>
          </div>
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-gray-400">{time}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`${styles.amountColor} font-bold`}>
            {type === "reward" ? "+" : ""}{amount}
          </div>
          <div className="text-xs text-gray-400">{usdValue}</div>
        </div>
      </div>
      <div className="text-xs text-gray-500 font-mono">{txHash}</div>
    </div>
  );
}
