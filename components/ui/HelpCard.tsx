interface HelpCardProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  gradient: string;
  border: string;
}

export default function HelpCard({
  icon,
  iconColor,
  title,
  description,
  gradient,
  border,
}: HelpCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} to-transparent rounded-xl p-4 border ${border}`}>
      <i className={`fas ${icon} ${iconColor} text-xl mb-3`}></i>
      <p className="font-medium text-sm mb-2">{title}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
