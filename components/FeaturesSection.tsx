import React, { useRef, useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactElement;
}

const features: Feature[] = [
  {
    title: "Smart Search & Filters",
    description: "Effortlessly find dApps by category, tags, or performance metrics with our advanced filtering system.",
    icon: <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  },
  {
    title: "Real-Time Insights",
    description: "Access up-to-date analytics, user activity, and on-chain data to make informed decisions.",
    icon: <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
  },
  {
    title: "Community Reviews",
    description: "Leverage crowd-sourced wisdom with genuine user reviews and ratings for every project.",
    icon: <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>
  },
  {
    title: "Developer Submissions",
    description: "A streamlined process for developers to submit their projects and gain visibility in the ecosystem.",
    icon: <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
  }
];

const FeatureCard: React.FC<{ feature: Feature, index: number }> = ({ feature, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref}
            className="bg-indigo-950/20 p-8 rounded-2xl card-glow-border transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
            style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)'}}
        >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-display text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
        </div>
    );
};

interface FeaturesSectionProps {
    animatedBackgroundsEnabled: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ animatedBackgroundsEnabled }) => {
  return (
    <section id="features" className="relative py-20 lg:py-32 bg-indigo-950/40">
      {animatedBackgroundsEnabled && <ParticleBackground />}
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Platform Highlights</h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">Everything you need to navigate the Sui dApp landscape.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index}/>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;