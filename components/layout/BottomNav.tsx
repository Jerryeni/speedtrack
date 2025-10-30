"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: "fa-home", label: "Dashboard" },
    { href: "/pools", icon: "fa-swimming-pool", label: "Pools" },
    { href: "/analytics", icon: "fa-chart-line", label: "Analytics" },
    { href: "/wallet", icon: "fa-wallet", label: "Wallet" },
    { href: "/profile", icon: "fa-user", label: "Profile" },
  ];

  const getColor = (href: string) => {
    if (pathname === href) return "text-neon-blue";
    const colors: Record<string, string> = {
      "/pools": "hover:text-electric-purple",
      "/analytics": "hover:text-green-400",
      "/wallet": "hover:text-yellow-400",
      "/profile": "hover:text-purple-400",
    };
    return `text-gray-400 ${colors[href] || "hover:text-neon-blue"}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700 px-4 py-3 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center space-y-1 transition-colors ${getColor(item.href)}`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
