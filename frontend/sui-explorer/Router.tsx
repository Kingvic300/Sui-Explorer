

import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import ProjectCardSkeleton from './components/ui/skeletons/ProjectCardSkeleton';
import ProjectDetailSkeleton from './components/ui/skeletons/ProjectDetailSkeleton';
import FeedPostSkeleton from './components/ui/skeletons/FeedPostSkeleton';
import NewsPageSkeleton from './components/ui/skeletons/NewsPageSkeleton';

const PageSkeleton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
    </div>
);

const ProjectsPage = React.lazy(() => import('./pages/DashboardPage'));
const ProjectDetailPage = React.lazy(() => import('./pages/ProjectDetailPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage'));
const SubmitProjectPage = React.lazy(() => import('./pages/SubmitProjectPage'));
const NewsPage = React.lazy(() => import('./pages/NewsPage'));


const AppRoutes: React.FC = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                    <Route index element={
                        <Suspense fallback={null}>
                            <LandingPage />
                        </Suspense>
                    } />
                    <Route path="/projects" element={
                        <Suspense fallback={<PageSkeleton><div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><ProjectCardSkeleton count={8} /></div></PageSkeleton>}>
                            <ProjectsPage />
                        </Suspense>
                    } />
                    <Route path="/projects/:projectId" element={
                        <Suspense fallback={<PageSkeleton><ProjectDetailSkeleton /></PageSkeleton>}>
                            <ProjectDetailPage />
                        </Suspense>
                    } />
                    <Route path="/projects/:projectId/:productId" element={
                        <Suspense fallback={<PageSkeleton><ProjectDetailSkeleton /></PageSkeleton>}>
                            <ProductDetailPage />
                        </Suspense>
                    } />
                    <Route path="/community" element={
                        <Suspense fallback={<PageSkeleton><div className="space-y-4"><FeedPostSkeleton count={3} /></div></PageSkeleton>}>
                            <CommunityPage />
                        </Suspense>
                    } />
                    <Route path="/news" element={
                        <Suspense fallback={<PageSkeleton><NewsPageSkeleton /></PageSkeleton>}>
                            <NewsPage />
                        </Suspense>
                    } />
                    <Route path="/about" element={
                        <Suspense fallback={<div />}>
                            <AboutPage />
                        </Suspense>
                    } />
                    <Route path="/features" element={
                        <Suspense fallback={<div />}>
                            <FeaturesPage />
                        </Suspense>
                    } />
                    <Route path="/submit-project" element={
                        <Suspense fallback={<div />}>
                            <SubmitProjectPage />
                        </Suspense>
                    } />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

const AppRouter: React.FC = () => {
  return (
    <HashRouter>
        <AppRoutes />
    </HashRouter>
  );
};

export default AppRouter;