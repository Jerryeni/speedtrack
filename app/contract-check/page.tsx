import ContractAddressChecker from '@/components/dev/ContractAddressChecker';

export default function ContractCheckPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Contract Deployment Checker
          </h1>
          <p className="text-gray-400">
            Verify that your contracts are properly deployed on BSC Testnet
          </p>
        </div>
        
        <ContractAddressChecker />
        
        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Common Issues</h2>
          
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                ❌ Contract Not Found
              </h3>
              <p className="text-sm mb-2">
                If you see "No contract found", it means:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>The contract hasn't been deployed to BSC Testnet</li>
                <li>The address in .env.local is incorrect</li>
                <li>You're using a local Hardhat address on BSC Testnet</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                🔧 How to Fix
              </h3>
              <ol className="list-decimal list-inside text-sm space-y-1 ml-4">
                <li>Deploy your contracts to BSC Testnet using Hardhat</li>
                <li>Copy the deployed contract addresses from deployment logs</li>
                <li>Update .env.local with the correct addresses</li>
                <li>Restart your Next.js dev server (npm run dev)</li>
                <li>Refresh this page to verify</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                📝 Example .env.local
              </h3>
              <pre className="bg-black p-4 rounded text-xs overflow-x-auto">
{`# BSC Testnet Addresses
NEXT_PUBLIC_SPEEDTRACK_ADDRESS=0x63A8950CBC7108e8A99C67406D97aaCb86eD7c57
NEXT_PUBLIC_STTOKEN_ADDRESS=0x8058aE55731ab8dF54DFdf3f21469830F89f35Ed
NEXT_PUBLIC_USDT_ADDRESS=0x0D3E80cBc9DDC0a3Fdee912b99C50cd0b5761eE3

# Network Config
NEXT_PUBLIC_CHAIN_ID=97
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545/
NEXT_PUBLIC_BLOCK_EXPLORER=https://testnet.bscscan.com`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
