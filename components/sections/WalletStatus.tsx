interface WalletStatusProps {
  address: string;
  ethBalance: string;
  usdBalance: string;
}

export default function WalletStatus({ 
  address, 
  ethBalance, 
  usdBalance 
}: WalletStatusProps) {
  return (
    <section className="px-4 mb-6">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <i className="fas fa-wallet text-green-400"></i>
            </div>
            <div>
              <p className="font-semibold text-green-400">Wallet Connected</p>
              <p className="text-xs text-gray-400 font-mono">{address}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white">{ethBalance}</p>
            <p className="text-xs text-gray-400">{usdBalance}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
