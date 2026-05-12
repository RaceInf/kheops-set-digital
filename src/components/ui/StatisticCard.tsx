import { motion } from 'framer-motion';

interface StatisticCardProps {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export function StatisticCard({ value, label, description, icon, delay = 0 }: StatisticCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-kheops-gold/10 text-kheops-gold mb-4 mx-auto">
        {icon}
      </div>
      <h4 className="text-3xl font-bold text-center text-gray-900 mb-2">{value}</h4>
      <h5 className="text-lg font-semibold text-center text-gray-800 mb-2">{label}</h5>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </motion.div>
  );
} 