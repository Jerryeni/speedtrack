"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="px-4 py-8 h-[600px] flex flex-col justify-center">
      <div className="text-center">
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-electric-purple p-1 animate-pulse-custom">
            <div className="w-full h-full rounded-full bg-dark-primary flex items-center justify-center">
              <i className="fas fa-tachometer-alt text-4xl text-neon-blue animate-floating"></i>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-electric-purple flex items-center justify-center animate-pulse-custom">
            <span className="text-white text-xs font-bold">2X</span>
          </div>
        </div>

        <h1 className="text-3xl font-orbitron font-bold mb-4 leading-tight">
          <span className="text-neon-blue">Double Your Speed,</span>
          <br />
          <span className="text-electric-purple">Double Your Earnings</span>
        </h1>

        <p className="text-gray-300 text-base mb-8 leading-relaxed px-4">
          Join the revolutionary 2X Pool system where your investments race through automated cycles, 
          multiplying your returns with blockchain transparency and lightning speed.
        </p>

        <Link href="/wallet" className="block w-full max-w-xs mx-auto mb-6">
          <Button className="w-full py-4 rounded-2xl text-lg">
            <i className="fas fa-wallet mr-2"></i>
            Connect Wallet & Start Racing
          </Button>
        </Link>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-custom"></div>
          <span>24,891 racers already earning</span>
        </div>
      </div>
    </section>
  );
}
