import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({ 
  children, 
  variant = "primary", 
  className = "",
  ...props 
}: ButtonProps) {
  const baseStyles = "font-semibold transition-all duration-300 min-h-[44px] px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-base rounded-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary neon-glow hover:shadow-lg",
    secondary: "bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
