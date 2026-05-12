import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import './ChartStyles.css';

// SVG Icons
const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.57-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.91 4.91.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.25-1.69 4.77-4.91 4.91-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.25-.15-4.77-1.69-4.91-4.91-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.25 1.69-4.77 4.91-4.91 1.27-.06 1.65-.07 4.85-.07zm0-2.16c-3.24 0-3.66.01-4.94.07-4.12.2-6.06 2.15-6.26 6.26-.06 1.28-.07 1.7-.07 4.94s.01 3.66.07 4.94c.2 4.12 2.15 6.06 6.26 6.26 1.28.06 1.7.07 4.94.07s3.66-.01 4.94-.07c4.12-.2 6.06-2.15 6.26-6.26.06-1.28.07-1.7.07-4.94s-.01-3.66-.07-4.94c-.2-4.12-2.15-6.06-6.26-6.26-1.28-.06-1.7-.07-4.94-.07zm0 5.51c-3.04 0-5.5 2.46-5.5 5.5s2.46 5.5 5.5 5.5 5.5-2.46 5.5-5.5-2.46-5.5-5.5-5.5zm0 9.07c-1.97 0-3.57-1.6-3.57-3.57s1.6-3.57 3.57-3.57 3.57 1.6 3.57 3.57-1.6 3.57-3.57 3.57zm7.33-9.16c-.71 0-1.29-.58-1.29-1.29s.58-1.29 1.29-1.29 1.29.58 1.29 1.29-.58 1.29-1.29 1.29z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
  </svg>
);

interface PlatformData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactElement;
  trend: 'up' | 'down';
  change: number;
}

const EngagementChart: React.FC = () => {
  const { theme } = useTheme();
  const [activePlatform, setActivePlatform] = useState<string | null>(null);

  const platforms: PlatformData[] = [
    {
      name: 'TikTok',
      value: 12.5,
      color: 'from-[#25F4EE] to-[#25F4EE]/70',
      icon: <TikTokIcon />,
      trend: 'up',
      change: 18
    },
    {
      name: 'IG',
      value: 6.8,
      color: 'from-[#E1306C] to-[#F77737]',
      icon: <InstagramIcon />,
      trend: 'up',
      change: 12
    },
    {
      name: 'YouTube Shorts',
      value: 4.2,
      color: 'from-[#FF0000] to-[#FF6B6B]',
      icon: <YouTubeIcon />,
      trend: 'up',
      change: 8
    },
    {
      name: 'Facebook',
      value: 2.1,
      color: 'from-[#1877F2] to-[#4E9AFF]',
      icon: <FacebookIcon />,
      trend: 'down',
      change: 5
    }
  ];

  const maxValue = Math.max(...platforms.map(p => p.value)) * 1.2;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 sm:my-12 md:my-16 px-3 sm:px-4">
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Performance d'Engagement
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-2">
          Analyse comparative des taux d'engagement moyens sur les principales plateformes
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {platforms.map((platform) => {
          const isActive = activePlatform === platform.name || activePlatform === null;
          const widthPercentage = (platform.value / maxValue) * 100;
          
          return (
            <div 
              key={platform.name}
              className="relative group"
              onMouseEnter={() => setActivePlatform(platform.name)}
              onMouseLeave={() => setActivePlatform(null)}
            >
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">{platform.icon}</span>
                  <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200">
                    {platform.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {platform.value}%
                  </span>
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${
                    platform.trend === 'up' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {platform.trend === 'up' ? '↑' : '↓'} {platform.change}%
                  </span>
                </div>
              </div>
              
              <div className="bar-container h-2.5 sm:h-3">
                <div 
                  className={`engagement-bar h-full ${platform.color} ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`}
                  style={{
                    '--bar-width': `${isActive ? widthPercentage : 0}%`
                  } as React.CSSProperties}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-lg sm:rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200 leading-relaxed">
            TikTok domine avec un engagement 84% supérieur à IG Reels
          </p>
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-blue-100 dark:border-blue-800/30">
            <p className="text-[10px] sm:text-xs text-blue-600/80 dark:text-blue-400/80">
              Données mises à jour en mars 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementChart;
