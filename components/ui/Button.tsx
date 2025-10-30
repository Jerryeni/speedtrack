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
  const baseStyles = "font-semibold transition-all duration-300";
  const variants = {
    primary: "bg-gradient-to-r from-neon-blue to-electric-purple text-dark-primary neon-glow",
    secondary: "bg-neon-blue/20 text-neon-blue",
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
