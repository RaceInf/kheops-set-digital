import React, { useState } from 'react';
import { TableOfContentsItem } from '@/types';
import { Table, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

interface EbookTableOfContentsProps {
  items: TableOfContentsItem[];
}

const EbookTableOfContents = ({ items }: EbookTableOfContentsProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Organiser les chapitres et sous-chapitres
  const chapters: { parent: TableOfContentsItem, children: TableOfContentsItem[] }[] = [];
  let currentParent: TableOfContentsItem | null = null;
  let currentChildren: TableOfContentsItem[] = [];

  items.forEach(item => {
    if (item.level === 1) {
      if (currentParent) {
        chapters.push({ parent: currentParent, children: [...currentChildren] });
        currentChildren = [];
      }
      currentParent = item;
    } else if (item.level === 2 && currentParent) {
      currentChildren.push(item);
    }
  });

  // Ajouter le dernier chapitre
  if (currentParent) {
    chapters.push({ parent: currentParent, children: [...currentChildren] });
  }

  const [openChapter, setOpenChapter] = useState<string | null>(null);

  const toggleChapter = (chapterId: string) => {
    setOpenChapter(prev => prev === chapterId ? null : chapterId);
  };

  // Compter uniquement les chapitres de niveau 1
  const chapterCount = chapters.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <Table className="text-kheops-gold h-5 w-5" />
        <h3 className="text-xl font-bold mt-4 md:mt-4">Table des matières</h3>
        <Badge 
          className="hidden sm:inline-flex ml-auto bg-kheops-salmon whitespace-nowrap text-[10px] sm:text-xs md:text-sm"
        >
          {chapters.length} chapitres
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
        {chapters.map(({ parent, children }, index) => (
          <Collapsible
            key={parent.id}
            open={openChapter === parent.id}
            onOpenChange={() => toggleChapter(parent.id)}
            className="border border-kheops-gold/10 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <CollapsibleTrigger asChild>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 bg-gradient-to-r from-kheops-gold/5 to-kheops-salmon/5 hover:from-kheops-gold/10 hover:to-kheops-salmon/10 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className={`h-5 w-5 text-kheops-gold transition-transform duration-300 ${openChapter === parent.id ? 'rotate-90' : ''}`} />
                  <span className="font-semibold text-lg">{parent.title}</span>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-kheops-gold transition-transform duration-300 ${openChapter === parent.id ? 'rotate-180' : ''}`} 
                />
              </motion.div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <AnimatePresence>
                {children.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 py-2 bg-gray-50/50 space-y-2"
                  >
                    {children.map((subItem) => (
                      <motion.div
                        key={subItem.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-7 p-2 border-l-2 border-kheops-gold/30 pl-4 text-gray-700 hover:text-kheops-gold transition-colors"
                      >
                        {subItem.title}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </motion.div>
  );
};

export default EbookTableOfContents;
