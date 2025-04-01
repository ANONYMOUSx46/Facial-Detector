
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import DetectionSection from '@/components/DetectionSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <DetectionSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
