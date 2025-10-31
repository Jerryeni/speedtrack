"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: "fa-home", label: "Dashboard" },
    { href: "/trade", icon: "fa-exchange-alt", label: "Trade" },
    { href: "/referral", icon: "fa-users", label: "Referral" },
    { href: "/income", icon: "fa-chart-line", label: "Income" },
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

  const handleTap = (e: React.MouseEvent) => {
    // Provide haptic feedback on tap if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700 z-40 safe-area-inset backdrop-blur-sm">
      <div className="flex items-center justify-around px-1 sm:px-2 py-2 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleTap}
              className={`
                flex flex-col items-center justify-center gap-0.5 sm:gap-1
                min-w-[56px] sm:min-w-[64px] min-h-[48px] 
                px-2 sm:px-3 py-2 rounded-lg
                transition-all duration-200
                ${getColor(item.href)}
                ${isActive ? 'bg-neon-blue/10 scale-105' : 'active:scale-95'}
              `.trim().replace(/\s+/g, ' ')}
            >
              <i className={`fas ${item.icon} ${isActive ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}></i>
              <span className={`text-[10px] sm:text-xs font-medium leading-tight ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
