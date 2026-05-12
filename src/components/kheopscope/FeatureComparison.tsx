import React from 'react';
import { CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { useMediaQuery } from '../../hooks/use-media-query';

interface FeatureItem {
  feature: string;
  tiktok: boolean;
  instagram: boolean;
}

const features: FeatureItem[] = [
  { feature: 'Découvrabilité organique', tiktok: true, instagram: false },
  { feature: 'Intégration e-commerce', tiktok: false, instagram: true },
  { feature: 'Outils professionnels', tiktok: false, instagram: true },
  { feature: 'Viralité potentielle', tiktok: true, instagram: false },
  { feature: 'Audience diversifiée', tiktok: false, instagram: true },
  { feature: 'Analytics avancées', tiktok: false, instagram: true },
  { feature: 'Créativité native', tiktok: true, instagram: false },
  { feature: 'Monétisation directe', tiktok: false, instagram: true },
];

const FeatureComparison: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Comparaison des Fonctionnalités
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Aperçu des capacités natives par plateforme
          </p>
        </div>

        <div className="space-y-4">
          {features.map((item, index) => (
            <div 
              key={index}
              className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800/50"
            >
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.feature}</h4>
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
                <div className="p-3 flex flex-col items-center justify-center space-y-2">
                  <span className="text-sm font-medium text-[#25F4EE]">TikTok</span>
                  {item.tiktok ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="p-3 flex flex-col items-center justify-center space-y-2">
                  <span className="text-sm font-medium text-[#E1306C]">IG Reels</span>
                  {item.instagram ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Comparaison des Fonctionnalités
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Aperçu des capacités natives et des outils disponibles sur chaque plateforme
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <div className="min-w-[500px] md:min-w-full">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base font-semibold">
                Fonctionnalités
                </th>
                <th className="text-center py-3 px-2 sm:px-4 text-[#25F4EE] text-sm sm:text-base font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    <span>TikTok</span>
                  </div>
                </th>
                <th className="text-center py-3 px-2 sm:px-4 text-[#E1306C] text-sm sm:text-base font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    <span>IG Reels</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((item, index) => (
                <tr
                  key={index}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="py-3 px-3 sm:px-4 text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
                    {item.feature}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    {item.tiktok ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mx-auto opacity-70" />
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    {item.instagram ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mx-auto opacity-70" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeatureComparison;
