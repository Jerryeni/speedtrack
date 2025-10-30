import IconCircle from "@/components/ui/IconCircle";
import FeatureCard from "@/components/ui/FeatureCard";

export default function About() {
  return (
    <section className="px-4 mb-8">
      <div className="text-center mb-6">
        <IconCircle size="lg" className="mx-auto mb-4">
          <i className="fas fa-flag-checkered text-2xl text-neon-blue"></i>
        </IconCircle>
        <h2 className="text-2xl font-orbitron font-bold mb-3">About Speed Track</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Speed Track revolutionizes DeFi with automated 2X multiplier pools that process 
          investments at lightning speed through smart contract technology.
        </p>
      </div>

      <div className="space-y-4">
        <FeatureCard
          icon="fa-bolt"
          title="Lightning Fast Processing"
          description="Our advanced algorithms process pool cycles in under 60 seconds, ensuring rapid reward distribution."
          gradient="from-neon-blue/10"
          iconColor="text-neon-blue"
        />
        <FeatureCard
          icon="fa-shield-alt"
          title="Guaranteed 2X Returns"
          description="Every completed pool cycle guarantees exactly 2X your initial investment through our proven smart contract system."
          gradient="from-electric-purple/10"
          iconColor="text-electric-purple"
        />
        <FeatureCard
          icon="fa-users"
          title="Community Powered"
          description="Join thousands of racers who have already multiplied their investments in our transparent ecosystem."
          gradient="from-green-400/10"
          iconColor="text-green-400"
        />
      </div>
    </section>
  );
}
