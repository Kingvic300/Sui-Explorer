

import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../data/projects';
import ParticleBackground from './ParticleBackground';

interface SpotlightSectionProps {
  projects: Project[];
  onViewDetails: (project: Project) => void;
  animatedBackgroundsEnabled: boolean;
}

const SpotlightSection: React.FC<SpotlightSectionProps> = ({ projects, onViewDetails, animatedBackgroundsEnabled }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const spotlightProjects = projects.slice(0, 4);

  const nextSlide = useCallback(() => {
    if (spotlightProjects.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % spotlightProjects.length);
  }, [spotlightProjects.length]);

  const prevSlide = () => {
    if (spotlightProjects.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + spotlightProjects.length) % spotlightProjects.length);
  };

  useEffect(() => {
    if (spotlightProjects.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, spotlightProjects.length]);

  return (
    <section id="projects" className="relative py-20 lg:py-32 overflow-hidden">
      {animatedBackgroundsEnabled && <ParticleBackground />}
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Project Spotlight</h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">Discover top-tier projects making waves in the ecosystem.</p>
        </div>
        <div className="relative h-[500px]">
          {spotlightProjects.map((project, index) => {
             const length = spotlightProjects.length;
             // Calculate signed distance from current index, handling wrap-around
             let distance = index - currentIndex;
             if (distance > length / 2) distance -= length;
             if (distance < -length / 2) distance += length;

             let transform = '';
             let zIndex = 0;
             let opacity = 0;
             let imageOpacityClass = 'opacity-30';

             switch (distance) {
                case 0: // Current
                    transform = 'translateX(0) scale(1)';
                    opacity = 1;
                    zIndex = length + 1;
                    imageOpacityClass = 'opacity-40';
                    break;
                case 1: // Next
                    transform = 'translateX(50%) scale(0.8)';
                    opacity = 0.7;
                    zIndex = length;
                    break;
                case -1: // Previous
                    transform = 'translateX(-50%) scale(0.8)';
                    opacity = 0.7;
                    zIndex = length - 1;
                    break;
                default: // Hidden
                    if (distance > 1) { // Far right
                        transform = 'translateX(100%) scale(0.7)';
                    } else { // Far left
                        transform = 'translateX(-100%) scale(0.7)';
                    }
                    opacity = 0;
                    zIndex = length - Math.abs(distance);
                    break;
             }
             
             const transformStyle = { transform };

             return (
                 <div
                     key={project.id}
                     className="carousel-item absolute w-full md:w-3/4 lg:w-2/3 h-full left-0 right-0 mx-auto"
                     style={{ ...transformStyle, opacity, zIndex}}
                 >
                     <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
                         <img src={project.banner} alt={project.name} className={`w-full h-full object-cover transition-opacity duration-500 ${imageOpacityClass}`} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                         <div className="absolute bottom-0 left-0 p-8 text-left">
                             <div className="flex items-center mb-4">
                                 <img src={project.logo} alt={`${project.name} logo`} className="w-16 h-16 rounded-full border-2 border-white/20 mr-4" />
                                 <div>
                                     <h3 className="font-display text-3xl font-bold text-white">{project.name}</h3>
                                     <p className="text-gray-300 text-lg">{project.tagline}</p>
                                 </div>
                             </div>
                             <button onClick={() => onViewDetails(project)} className="mt-2 bg-white/10 border border-white/20 text-white font-semibold py-2 px-5 rounded-lg hover:bg-white/20 transition-all duration-300">
                                 View Details
                             </button>
                         </div>
                     </div>
                 </div>
             );
          })}
        </div>
        {spotlightProjects.length > 1 && (
            <div className="flex justify-center mt-8 gap-4">
                <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default SpotlightSection;