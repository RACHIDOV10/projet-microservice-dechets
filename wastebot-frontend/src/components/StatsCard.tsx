import { LucideIcon } from 'lucide-react';

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  subtitle?: string;
};

export function StatsCard({ title, value, icon: Icon, color, subtitle }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20 text-blue-600 dark:text-blue-400',
    green: 'bg-gradient-to-br from-green-500/20 to-emerald-600/10 dark:from-green-500/30 dark:to-emerald-600/20 text-green-600 dark:text-green-400',
    purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 dark:from-orange-500/30 dark:to-orange-600/20 text-orange-600 dark:text-orange-400',
  };

  const gradientText = {
    blue: 'bg-gradient-to-br from-blue-600 to-blue-400',
    green: 'bg-gradient-to-br from-green-600 to-emerald-400',
    purple: 'bg-gradient-to-br from-purple-600 to-purple-400',
    orange: 'bg-gradient-to-br from-orange-600 to-orange-400',
  };

  return (
    <div className="glass rounded-2xl shadow-premium border border-white/20 dark:border-white/10 p-5 md:p-6 transition-premium hover:scale-105 hover:shadow-premium-lg group relative overflow-hidden animate-scaleIn">
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses[color].split(' ')[0]} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-3xl md:text-4xl font-bold ${gradientText[color]} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center flex-shrink-0 shadow-lg transition-premium group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}
