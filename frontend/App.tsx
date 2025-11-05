import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import SpotlightSection from './components/SpotlightSection';
import CommunitySection from './components/CommunitySection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import Dashboard from './components/Dashboard';
import SubmitProjectModal from './components/dashboard/SubmitProjectModal';
import { Project, projectsData, Review } from './data/projects';
import Notification from './components/Notification';
import CommunityPage from './components/CommunityPage';
import AuthModal from './components/auth/AuthModal';
import ProjectModal from './components/dashboard/ProjectModal';
import { apiCall } from './utils/api';
import ProfilePage from './components/ProfilePage';

const LandingPageContent: React.FC<{ 
    onNavigate: () => void; 
    onSubmitProjectClick: () => void; 
    projects: Project[];
    onViewProjectDetails: (project: Project) => void;
    animatedBackgroundsEnabled: boolean;
}> = ({ onNavigate, onSubmitProjectClick, projects, onViewProjectDetails, animatedBackgroundsEnabled }) => (
  <>
    <HeroSection onNavigateToDashboard={onNavigate} onSubmitProjectClick={onSubmitProjectClick} />
    <AboutSection animatedBackgroundsEnabled={animatedBackgroundsEnabled} />
    <FeaturesSection animatedBackgroundsEnabled={animatedBackgroundsEnabled} />
    <SpotlightSection projects={projects} onViewDetails={onViewProjectDetails} animatedBackgroundsEnabled={animatedBackgroundsEnabled} />
    <CommunitySection animatedBackgroundsEnabled={animatedBackgroundsEnabled} />
    <CTASection onNavigateToDashboard={onNavigate} animatedBackgroundsEnabled={animatedBackgroundsEnabled} />
  </>
);

const App: React.FC = () => {
  const [page, setPage] = useState<'landing' | 'dashboard' | 'community' | 'profile'>('landing');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });
  const [favoriteProjectIds, setFavoriteProjectIds] = useState(new Set<number>());
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);
  const [user, setUser] = useState<{ address: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postAuthAction, setPostAuthAction] = useState<(() => void) | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [animatedBackgroundsEnabled, setAnimatedBackgroundsEnabled] = useState(true);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
  }, []);

  // FIX: Updated `fetchProjects` to return a Promise to satisfy the `onRefreshProjects` prop type in `Dashboard`.
  const fetchProjects = useCallback(() => {
    setIsLoading(true);
    // Using dummy data directly to ensure projects always load.
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            setProjects(projectsData);
            setIsLoading(false);
            resolve();
        }, 500);
    });
  }, []);

  useEffect(() => {
    // FIX: `useEffect` should not return a promise. `void` is used to ignore the returned promise from `fetchProjects`.
    void fetchProjects();
  }, [fetchProjects]);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const trail = document.getElementById('mouse-trail');
      const dot = document.getElementById('cursor-dot');
      if (trail) {
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
      }
      if (dot) {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    try {
        const storedFavorites = localStorage.getItem('favoriteProjectIds');
        if (storedFavorites) {
            setFavoriteProjectIds(new Set(JSON.parse(storedFavorites)));
        }
        const storedViewed = localStorage.getItem('recentlyViewedProjectIds');
        if (storedViewed) {
            setRecentlyViewedIds(JSON.parse(storedViewed));
        }
        const storedBgSetting = localStorage.getItem('animatedBackgroundsEnabled');
        if (storedBgSetting) {
            setAnimatedBackgroundsEnabled(JSON.parse(storedBgSetting));
        }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  const toggleAnimatedBackgrounds = () => {
    setAnimatedBackgroundsEnabled(prev => {
        const newState = !prev;
        try {
            localStorage.setItem('animatedBackgroundsEnabled', JSON.stringify(newState));
        } catch (error) {
            console.error("Failed to save animated backgrounds setting to localStorage", error);
        }
        return newState;
    });
  };

  const handleLoginSuccess = (walletAddress: string) => {
    setUser({ address: walletAddress });
    setIsAuthModalOpen(false);
    showNotification("Wallet connected successfully!");
    if (postAuthAction) {
        postAuthAction();
        setPostAuthAction(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    if(page === 'profile'){
        navigateToLanding();
    }
    showNotification("Wallet disconnected.");
  };

  const requireAuth = (action: () => void) => {
    if (!user) {
        setPostAuthAction(() => action);
        setIsAuthModalOpen(true);
    } else {
        action();
    }
  };


  const navigateToDashboard = () => {
    setPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const navigateToCommunity = () => {
    setPage('community');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const navigateToProfile = () => {
    requireAuth(() => {
        setPage('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const navigateToLanding = (hash?: string) => {
    setPage('landing');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitProject = async (newProjectData: Omit<Project, 'id' | 'stats' | 'reviews'>) => {
    const createProject = (): Project => ({
        ...newProjectData,
        id: Date.now(), // Temporary ID
        stats: { tvl: "TBD", users: "New", volume: "N/A" },
        reviews: []
    });

    const newProject = await apiCall(createProject, showNotification, {
        delay: 1000,
        failChance: 0.3,
        errorMessage: 'Server is busy. Please try again.',
        errorStatus: 503,
        errorPrefix: 'Submission Failed',
        rethrow: true
    });

    if (newProject) {
        setProjects(prevProjects => [newProject, ...prevProjects]);
        showNotification("Project submitted successfully!");
    }
  };

  const handleAddReview = async (projectId: number, review: Omit<Review, 'id' | 'avatar'>) => {
    const createReview = (): Review => ({
        ...review,
        id: Date.now(),
        avatar: `https://picsum.photos/seed/avatar${Date.now()}/100/100`
    });

    const newReview = await apiCall(createReview, showNotification, {
        delay: 500,
        failChance: 0.3,
        errorMessage: 'Could not submit review due to a server error.',
        errorStatus: 500,
        errorPrefix: 'Review Failed',
        rethrow: true
    });

    if (newReview) {
        const updatedProjects = projects.map(p => {
            if (p.id === projectId) {
                return { ...p, reviews: [newReview, ...p.reviews] };
            }
            return p;
        });
        setProjects(updatedProjects);
        if (selectedProject && selectedProject.id === projectId) {
            setSelectedProject(prev => prev ? { ...prev, reviews: [newReview, ...prev.reviews] } : null);
        }
        showNotification("Review submitted successfully!");
    }
  };

  const toggleFavoriteProject = (projectId: number) => {
    requireAuth(() => {
        setFavoriteProjectIds(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(projectId)) {
                newFavorites.delete(projectId);
                showNotification("Removed from favorites!");
            } else {
                newFavorites.add(projectId);
                showNotification("Added to favorites!");
            }
            try {
                localStorage.setItem('favoriteProjectIds', JSON.stringify([...newFavorites]));
            } catch (error) {
                console.error("Failed to save favorites to localStorage:", error);
            }
            return newFavorites;
        });
    });
  };

  const handleProjectView = (projectId: number) => {
    setRecentlyViewedIds(prevIds => {
        const newIds = [projectId, ...prevIds.filter(id => id !== projectId)];
        const limitedIds = newIds.slice(0, 4);
        
        try {
            localStorage.setItem('recentlyViewedProjectIds', JSON.stringify(limitedIds));
        } catch (error) {
            console.error("Failed to save recently viewed projects to localStorage", error);
        }

        return limitedIds;
    });
  };
  
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    handleProjectView(project.id);
  };

  const recentlyViewedProjects = useMemo(() => {
    return recentlyViewedIds.map(id => projects.find(p => p.id === id)).filter((p): p is Project => !!p);
  }, [recentlyViewedIds, projects]);

  const renderPage = () => {
    switch (page) {
        case 'landing':
            return <LandingPageContent 
                onNavigate={navigateToDashboard} 
                onSubmitProjectClick={() => setIsSubmitModalOpen(true)} 
                projects={projects}
                onViewProjectDetails={handleSelectProject}
                animatedBackgroundsEnabled={animatedBackgroundsEnabled}
            />;
        case 'dashboard':
            return <Dashboard 
                projects={projects} 
                onAddReview={handleAddReview}
                favoriteProjectIds={favoriteProjectIds}
                onToggleFavorite={toggleFavoriteProject}
                recentlyViewedProjects={recentlyViewedProjects}
                onSelectProject={handleSelectProject}
                isLoading={isLoading}
                projectsError={null}
                onSubmitProjectClick={() => setIsSubmitModalOpen(true)}
                user={user}
                onAuthRequired={requireAuth}
                showNotification={showNotification}
                onRefreshProjects={fetchProjects}
            />;
        case 'community':
            return <CommunityPage user={user} onAuthRequired={requireAuth} showNotification={showNotification} />;
        case 'profile':
            return <ProfilePage 
                user={user}
                projects={projects}
                favoriteProjectIds={favoriteProjectIds}
                onSelectProject={handleSelectProject}
                onToggleFavorite={toggleFavoriteProject}
                onAuthRequired={requireAuth}
                isLoading={isLoading}
            />
        default:
            return <LandingPageContent 
                onNavigate={navigateToDashboard} 
                onSubmitProjectClick={() => setIsSubmitModalOpen(true)}
                projects={projects}
                onViewProjectDetails={handleSelectProject}
                animatedBackgroundsEnabled={animatedBackgroundsEnabled}
            />;
    }
  }

  return (
    <div className="bg-transparent font-body text-gray-300 overflow-x-hidden">
      <div id="cursor-dot"></div>
      <div id="mouse-trail"></div>
      
      <div className="relative z-10">
        <Header 
          page={page}
          onNavigateToDashboard={navigateToDashboard} 
          onNavigateToCommunity={navigateToCommunity}
          onNavigateToProfile={navigateToProfile}
          onNavigateHome={navigateToLanding}
          onSubmitProjectClick={() => setIsSubmitModalOpen(true)}
          user={user}
          onConnectWallet={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          showNotification={showNotification}
        />
        <main>
            {renderPage()}
        </main>
        <Footer 
          animatedBackgroundsEnabled={animatedBackgroundsEnabled}
          onToggleAnimatedBackgrounds={toggleAnimatedBackgrounds}
        />
      </div>
      <ScrollToTopButton />
      {isSubmitModalOpen && <SubmitProjectModal onClose={() => setIsSubmitModalOpen(false)} onSubmit={handleSubmitProject} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      <Notification message={notification.message} isVisible={notification.visible} type={notification.type} />
      {selectedProject && (
        <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            onAddReview={handleAddReview} 
            isFavorite={favoriteProjectIds.has(selectedProject.id)}
            onToggleFavorite={() => toggleFavoriteProject(selectedProject.id)}
            user={user}
            onAuthRequired={requireAuth}
        />
      )}
    </div>
  );
};

export default App;