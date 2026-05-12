import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  productName?: string;
  variant?: 'default' | 'outline';
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const phoneNumber = '33600000000'; // Remplacez par votre numéro WhatsApp
  const message = productName
    ? `Bonjour, je suis intéressé(e) par votre produit : ${productName}`
    : 'Bonjour, je souhaite avoir plus d\'informations.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'py-2 px-4 h-10 min-w-10',
        variant === 'default' && 'bg-green-600 text-white hover:bg-green-700',
        variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    >
      {children || 'Contactez-nous sur WhatsApp'}
    </a>
  );
};

export default WhatsAppButton;