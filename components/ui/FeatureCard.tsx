import { ReactNode } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient, 
  iconColor 
}: FeatureCardProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} to-transparent rounded-2xl p-4 border ${gradient.replace('from-', 'border-')}/20`}>
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-full ${gradient.replace('from-', 'bg-')}/20 flex items-center justify-center mt-1`}>
          <i className={`fas ${icon} ${iconColor} text-sm`}></i>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-2">{title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
