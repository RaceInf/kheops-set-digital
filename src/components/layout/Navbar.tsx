import React, { useState, useEffect } from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CurrencySelector } from '@/components/ui/CurrencySelector';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isBoutiquePage = location.pathname === '/boutique';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Kheopscope', href: '/kheopscope' },
    { name: 'Boutique', href: '/boutique' },
    { name: 'À propos', href: '/apropos' }
  ];

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isBoutiquePage 
          ? "bg-transparent border-b border-white/10" 
          : "bg-white/95 backdrop-blur-sm shadow-sm",
        scrolled ? "py-2" : "py-4",
        className
      )}
      aria-label="Navigation principale"
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.span 
            className="font-bold text-lg sm:text-xl md:text-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-kheops-gold">KHEOPS</span> 
            <span className="text-kheops-salmon">SET</span> 
            <span>DIGITAL</span>
          </motion.span>
        </Link>

        {/* Navigation bureau */}
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-1 mr-auto">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <Link
                    to={link.href}
                    className={cn(
                      "group px-4 py-2 transition-colors duration-300 font-medium relative",
                      isBoutiquePage 
                        ? "text-white hover:text-kheops-gold" 
                        : "text-gray-800 hover:text-kheops-salmon",
                      location.pathname === link.href && (isBoutiquePage ? "text-kheops-gold" : "text-kheops-salmon"),
                      "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-kheops-salmon after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    )}
                  >
                    {link.name}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>
              
        <div className="hidden lg:flex items-center space-x-4">
                <CurrencySelector />
                <Button asChild className={cn(
            "transition-colors duration-300",
                  isBoutiquePage 
                    ? "bg-kheops-gold hover:bg-kheops-gold/90 text-gray-900" 
                    : "bg-kheops-gold hover:bg-kheops-salmon text-white"
                )}>
                  <Link to="/contact">Demander un devis</Link>
                </Button>
        </div>

        {/* Menu mobile - Utilisation du composant Sheet de shadcn UI */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="scale-75 sm:scale-90 md:scale-100">
          <CurrencySelector />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu principal">
                <Menu className="h-5 w-5" aria-label="Ouvrir le menu" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0" aria-label="Menu de navigation mobile">
              <div className="flex flex-col h-full">
                {/* En-tête avec logo et bouton de fermeture */}
                <div className="p-6 bg-gradient-to-r from-kheops-gold/10 to-kheops-salmon/10">
                  <span className="font-bold text-2xl">
                    <span className="text-kheops-gold">KHEOPS</span> 
                    <span className="text-kheops-salmon">SET</span> 
                    <span>DIGITAL</span>
                  </span>
                </div>
                
                <Separator />
                
                {/* Liens de navigation */}
                <nav className="flex-grow p-6">
                  <ul className="space-y-4">
                    {navLinks.map((link, index) => (
                      <motion.li 
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="overflow-hidden"
                      >
                        <Link
                          to={link.href}
                          className={cn(
                            "flex items-center justify-between py-2 px-2 rounded-lg font-medium text-lg transition-all duration-300",
                            location.pathname === link.href 
                              ? "bg-kheops-salmon/10 text-kheops-salmon" 
                              : "text-gray-800 hover:bg-gray-100"
                          )}
                        >
                          {link.name}
                          <ChevronRight 
                            className={cn(
                              "h-5 w-5 transition-all",
                              location.pathname === link.href ? "text-kheops-salmon" : "text-gray-400"
                            )} 
                          />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
                
                {/* Bouton d'appel à l'action */}
                <div className="p-6 bg-gradient-to-r from-kheops-gold/10 to-kheops-salmon/10">
                  <Button asChild className="w-full bg-kheops-gold hover:bg-kheops-salmon text-white transition-colors duration-300">
                    <Link to="/contact" className="w-full flex items-center justify-center">
                      Demander un devis
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
