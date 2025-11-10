
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Starfield from '../ui/Starfield';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Starfield />
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-5 main-border-glow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;