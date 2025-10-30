import { ReactNode } from "react";

interface IconCircleProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: string;
  bgColor?: string;
  className?: string;
}

export default function IconCircle({ 
  children, 
  size = "md",
  gradient = "from-neon-blue to-electric-purple",
  bgColor = "bg-dark-primary",
  className = ""
}: IconCircleProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <div className={`rounded-full bg-gradient-to-r ${gradient} p-1 ${className}`}>
      <div className={`${sizes[size]} rounded-full ${bgColor} flex items-center justify-center`}>
        {children}
      </div>
    </div>
  );
}
