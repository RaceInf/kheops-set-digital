import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  url, 
  title, 
  description = '', 
  className = '' 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      return;
    }

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setShowMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.error('Error sharing:', err);
        setShowMenu(true);
      }
    } else {
      setShowMenu(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Partager
      </Button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 min-w-[280px]">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 px-2 py-1">
                Partager cet article
              </h4>
              
              {/* Plateformes sociales */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Twitter</div>
                    <div className="text-xs text-gray-500">Partager</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Facebook</div>
                    <div className="text-xs text-gray-500">Partager</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                    <Linkedin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">LinkedIn</div>
                    <div className="text-xs text-gray-500">Partager</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">WhatsApp</div>
                    <div className="text-xs text-gray-500">Partager</div>
                  </div>
                </button>
              </div>

              {/* Séparateur */}
              <div className="border-t border-gray-200 my-2" />

              {/* Copier le lien */}
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {copied ? 'Lien copié !' : 'Copier le lien'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {copied ? 'Collé dans le presse-papiers' : 'Partager l\'URL'}
                  </div>
                </div>
              </button>

              {/* Ouvrir dans un nouvel onglet */}
              <button
                onClick={() => window.open(url, '_blank')}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Ouvrir</div>
                  <div className="text-xs text-gray-500">Dans un nouvel onglet</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare; 