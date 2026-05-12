
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface EbookImageGalleryProps {
  mainImage: string;
  additionalImages?: string[];
  title: string;
  activeIndex?: number;
  onImageChange?: React.Dispatch<React.SetStateAction<number>>;
}

const EbookImageGallery = ({ 
  mainImage, 
  additionalImages = [], 
  title,
  activeIndex = 0,
  onImageChange
}: EbookImageGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  const currentImage = allImages[activeIndex] || mainImage;
  
  const handleThumbnailClick = (index: number) => {
    if (onImageChange) {
      onImageChange(index);
    }
  };
  
  const nextImage = () => {
    const newIndex = (lightboxIndex + 1) % allImages.length;
    setLightboxIndex(newIndex);
  };
  
  const prevImage = () => {
    const newIndex = (lightboxIndex - 1 + allImages.length) % allImages.length;
    setLightboxIndex(newIndex);
  };
  
  return (
    <>
      <div className="space-y-4">
        <motion.div 
          className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-kheops-gold/20 bg-gray-100 cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300" 
          onClick={() => {
            setLightboxIndex(activeIndex);
            setIsOpen(true);
          }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img 
            src={currentImage} 
            alt={title} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="text-white" size={40} />
          </div>
          
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20 text-4xl font-bold rotate-[-30deg] pointer-events-none">
            APERÇU
          </div>
        </motion.div>
        
        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {allImages.map((img, idx) => (
              <motion.div
                key={idx}
                className={`relative cursor-pointer overflow-hidden rounded-md border-2 ${idx === activeIndex ? 'border-kheops-gold' : 'border-gray-200'} h-16 w-16 flex-shrink-0`}
                onClick={() => handleThumbnailClick(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <img 
                  src={img} 
                  alt={`${title} - vue ${idx + 1}`} 
                  className="object-cover w-full h-full" 
                />
                {idx === activeIndex && (
                  <div className="absolute inset-0 bg-kheops-gold/10 pointer-events-none" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <Button 
            variant="ghost" 
            className="absolute top-2 right-2 text-white z-50 rounded-full p-2 h-auto" 
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </Button>
          
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.img 
                key={allImages[lightboxIndex]}
                src={allImages[lightboxIndex]} 
                alt={title} 
                className="max-w-full max-h-[80vh] object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {allImages.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/40 rounded-full p-1 h-auto hover:bg-black/60" 
                  onClick={prevImage}
                >
                  <ChevronLeft size={28} />
                </Button>
                <Button 
                  variant="ghost" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/40 rounded-full p-1 h-auto hover:bg-black/60" 
                  onClick={nextImage}
                >
                  <ChevronRight size={28} />
                </Button>
              </>
            )}
          </div>
          
          {/* Thumbnail navigation in lightbox */}
          {allImages.length > 1 && !isMobile && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 justify-center">
              {allImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  className={`h-2 w-10 rounded-full cursor-pointer ${idx === lightboxIndex ? 'bg-white' : 'bg-white/30'}`}
                  onClick={() => setLightboxIndex(idx)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EbookImageGallery;
