import React from 'react';
import { useTheme } from 'next-themes';
import './ChartStyles.css';

interface MetricCardProps {
  title: string;
  tiktokValue: number;
  instagramValue: number;
  format: 'currency' | 'percentage' | 'number';
  isCostMetric?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  tiktokValue,
  instagramValue,
  format,
  isCostMetric = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const formatValue = (value: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } else if (format === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const isTikTokBetter = isCostMetric 
    ? tiktokValue < instagramValue 
    : tiktokValue > instagramValue;

  const maxValue = Math.max(tiktokValue, instagramValue) * 1.2;
  const tiktokPercentage = (tiktokValue / maxValue) * 100;
  const instagramPercentage = (instagramValue / maxValue) * 100;

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-sm'} 
      border ${isDark ? 'border-gray-700' : 'border-gray-100'} transition-all hover:shadow-md`}>
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{title}</h4>
      
      <div className="space-y-5">
        {/* TikTok Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`inline-block w-3 h-3 rounded-full bg-[#25F4EE]`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">TikTok</span>
            </div>
            <span className={`text-sm font-semibold ${isTikTokBetter ? 'text-[#25F4EE]' : 'text-gray-500 dark:text-gray-400'}`}>
              {formatValue(tiktokValue)}
            </span>
          </div>
          <div className="bar-container">
            <div 
              className="roi-bar bg-tiktok"
              style={{ width: `${tiktokPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Instagram Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-br from-[#F77737] via-[#E1306C] to-[#C13584]`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">IG</span>
            </div>
            <span className={`text-sm font-semibold ${!isTikTokBetter ? 'text-[#E1306C]' : 'text-gray-500 dark:text-gray-400'}`}>
              {formatValue(instagramValue)}
            </span>
          </div>
          <div className="bar-container">
            <div 
              className="roi-bar bg-instagram"
              style={{ width: `${instagramPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Winner Badge */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-center">
        <div className={`inline-flex items-center justify-center w-full max-w-[200px] px-3 py-1.5 rounded-full text-xs font-medium text-center ${
          isTikTokBetter 
            ? 'bg-[#25F4EE]/10 text-[#25F4EE]' 
            : 'bg-gradient-to-r from-[#E1306C]/10 to-[#F77737]/10 text-[#E1306C]'
        }`}>
          {isTikTokBetter ? 'TikTok' : 'IG'} est plus {isCostMetric ? 'économique' : 'performant'}
        </div>
      </div>
    </div>
  );
};

const RoiPerformanceChart: React.FC = () => {
  const metrics = [
    {
      title: 'Coût pour 1000 vues',
      tiktok: 20,
      instagram: 40,
      format: 'currency' as const,
      isCost: true,
    },
    {
      title: 'Taux de conversion',
      tiktok: 2.3,
      instagram: 4.8,
      format: 'percentage' as const,
      isCost: false,
    },
    {
      title: 'Coût par acquisition',
      tiktok: 15,
      instagram: 28,
      format: 'currency' as const,
      isCost: true,
    },
    {
      title: 'Valeur vie client',
      tiktok: 120,
      instagram: 180,
      format: 'currency' as const,
      isCost: false,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8">
      <div className="text-center mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Comparaison des Performances
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Analyse comparative des indicateurs clés entre TikTok et Instagram pour votre stratégie digitale
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            tiktokValue={metric.tiktok}
            instagramValue={metric.instagram}
            format={metric.format}
            isCostMetric={metric.isCost}
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs italic text-gray-500 dark:text-gray-400">
          Données mises à jour en temps réel • Analyse basée sur les performances moyennes du secteur
        </p>
      </div>
    </div>
  );
};

export default RoiPerformanceChart;
