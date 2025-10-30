export default function RewardsProgram() {
  return (
    <section className="px-4 mb-6">
      <h3 className="text-lg font-orbitron font-bold mb-4">Referral Rewards Program</h3>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple flex items-center justify-center">
                <i className="fas fa-trophy text-white text-lg"></i>
              </div>
              <div>
                <h4 className="font-semibold">Current Tier: Gold Racer</h4>
                <p className="text-xs text-gray-400">50+ active referrals</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-yellow-400">20%</p>
              <p className="text-xs text-gray-400">Bonus Rate</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Progress to Platinum</span>
              <span className="text-sm text-neon-blue">127/150</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-blue to-electric-purple rounded-full racing-track"
                style={{ width: "85%" }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>23 more referrals needed</span>
              <span>25% bonus at Platinum</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
