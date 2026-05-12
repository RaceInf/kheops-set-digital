import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import AboutSection from "@/components/home/AboutSection";
import KheopScopeSection from "@/components/home/KheopScopeSection";
import ShopSection from "@/components/home/ShopSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Seo from '@/components/seo/Seo';

const Index = () => {
  return (
    <>
      <Seo page="home" />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full overflow-x-hidden"
      >
        <Navbar />
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <KheopScopeSection />
        <ShopSection />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </motion.main>
    </>
  );
};

export default Index;
