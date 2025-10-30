import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import PoolFlow from "@/components/sections/PoolFlow";
import About from "@/components/sections/About";
import Blockchain from "@/components/sections/Blockchain";
import HowItWorks from "@/components/sections/HowItWorks";
import JoinNow from "@/components/sections/JoinNow";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <PoolFlow />
      <About />
      <Blockchain />
      <HowItWorks />
      <JoinNow />
    </main>
  );
}
