export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Connect Your Wallet",
      description: "Link your MetaMask, Trust Wallet, or any Web3 wallet to get started. No registration required.",
      color: "from-neon-blue to-electric-purple",
      titleColor: "text-neon-blue",
      icon: "fa-wallet",
      badge: "Secure & Anonymous",
      connector: "from-neon-blue to-electric-purple",
    },
    {
      number: 2,
      title: "Choose Investment Amount",
      description: "Select from preset amounts or enter custom value. Minimum investment starts at just $10.",
      color: "from-electric-purple to-neon-blue",
      titleColor: "text-electric-purple",
      amounts: ["$10", "$50", "$100"],
      connector: "from-electric-purple to-green-400",
    },
    {
      number: 3,
      title: "Wait for Pool to Fill",
      description: "Your investment enters the next available pool. Watch real-time progress as the pool fills up.",
      color: "from-green-400 to-emerald-500",
      titleColor: "text-green-400",
      showProgress: true,
      connector: "from-green-400 to-yellow-400",
    },
    {
      number: 4,
      title: "Receive 2X Reward",
      description: "Once the pool completes, receive exactly 2X your investment directly to your wallet instantly.",
      color: "from-yellow-400 to-orange-500",
      titleColor: "text-yellow-400",
      icon: "fa-trophy",
      badge: "Guaranteed Returns",
    },
  ];

  return (
    <section className="px-4 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-orbitron font-bold mb-3">How It Works</h2>
        <p className="text-gray-300 text-sm">Simple 4-step process to start earning</p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center font-orbitron font-bold text-dark-primary`}>
                {step.number}
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
                  <h3 className={`font-semibold text-sm mb-2 ${step.titleColor}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {step.icon && step.badge && (
                    <div className="mt-3 flex items-center space-x-2">
                      <i className={`fas ${step.icon} ${step.titleColor} text-xs`}></i>
                      <span className="text-xs text-gray-300">{step.badge}</span>
                    </div>
                  )}
                  
                  {step.amounts && (
                    <div className="mt-3 flex items-center space-x-4">
                      {step.amounts.map((amount) => (
                        <div key={amount} className="px-2 py-1 bg-electric-purple/20 text-electric-purple rounded text-xs">
                          {amount}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {step.showProgress && (
                    <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 racing-track"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b ${step.connector}`}></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
