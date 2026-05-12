import { Twitter, Instagram, Linkedin } from 'lucide-react';

interface SocialIconProps {
  network: 'twitter' | 'instagram' | 'linkedin';
  member: string;
  url: string;
  showIcon: boolean;
}

const SocialIcon = ({ network, member, url, showIcon }: SocialIconProps) => {
  if (!showIcon) return null;

  const icons = {
    twitter: <Twitter className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-kheops-gold hover:text-white transition-colors"
      aria-label={`${network} de ${member}`}
    >
      {icons[network]}
    </a>
  );
};

export default SocialIcon; 