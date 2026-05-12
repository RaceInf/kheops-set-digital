import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
  CartesianGrid
} from 'recharts';
import { useTheme } from 'next-themes';

interface DataPoint {
  age: string;
  TikTok: number;
  Instagram: number;
}

const data: DataPoint[] = [
  { age: '16-24', TikTok: 45, Instagram: 25 },
  { age: '25-34', TikTok: 35, Instagram: 35 },
  { age: '35-44', TikTok: 15, Instagram: 25 },
  { age: '45-54', TikTok: 4, Instagram: 12 },
  { age: '55+', TikTok: 1, Instagram: 3 },
];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100">{data.age}</p>
        <div className="mt-1 space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#25F4EE] rounded-sm mr-2"></div>
            <span className="text-sm">TikTok: <span className="font-medium">{data.TikTok}%</span></span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#E1306C] rounded-sm mr-2"></div>
            <span className="text-sm">Instagram: <span className="font-medium">{data.Instagram}%</span></span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const DemographicChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const barGradient = (color: string, suffix: string) => (
    <linearGradient id={`gradient-${suffix}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
    </linearGradient>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8">
      <div className="text-center mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Répartition démographique des utilisateurs
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Répartition par tranche d'âge des utilisateurs actifs sur les plateformes
        </p>
      </div>
      <div className="relative">
        <div className="absolute top-0 right-0 flex space-x-4 z-10">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#25F4EE] rounded-sm mr-1.5"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">TikTok</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#E1306C] rounded-sm mr-1.5"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Instagram</span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{
              top: 32,
              right: 8,
              left: 8,
              bottom: 8,
            }}
            barGap={isDark ? 4 : 8}
            barSize={32}
            onMouseMove={(state) => {
              if (state.isTooltipActive) {
                setActiveIndex(state.activeTooltipIndex ?? null);
              } else {
                setActiveIndex(null);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid vertical={false} stroke={isDark ? '#374151' : '#E5E7EB'} />
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12, fontWeight: 500 }}
              tickMargin={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              tickMargin={8}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            
            <defs>
              {barGradient('#25F4EE', 'tiktok')}
              {barGradient('#E1306C', 'instagram')}
            </defs>
            <Bar 
              dataKey="TikTok"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-300"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`tiktok-${index}`} 
                  fill={activeIndex === index ? '#25F4EE' : 'url(#gradient-tiktok)'}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="Instagram"
              radius={[4, 4, 0, 0]}
              className="transition-all duration-300"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`instagram-${index}`} 
                  fill={activeIndex === index ? '#E1306C' : 'url(#gradient-instagram)'}
                />
              ))}
            </Bar>
            
            <defs>
              <linearGradient id="tiktokGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#25F4EE" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#25F4EE" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="instagramGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E1306C" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#E1306C" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-2 flex justify-between px-2">
          {data.map((item, index) => (
            <div 
              key={index}
              className={`text-xs text-center transition-opacity duration-300 flex-1 min-w-0 ${
                activeIndex === index 
                  ? 'text-gray-900 dark:text-gray-100 font-medium' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {item.age}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemographicChart;
