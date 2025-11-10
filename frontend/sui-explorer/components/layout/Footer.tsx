import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';

const Footer: React.FC = () => {
  const links = [
    { to: "/about", text: "About" },
    { to: "/projects", text: "Projects" },
    { to: "/community", text: "Community" },
    { to: "/submit-project", text: "Submit Project" },
  ];

  return (
    <footer className="border-t border-light-border dark:border-dark-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-800 dark:text-slate-300">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Sui Ecosystem Explorer. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          {links.map(link => (
            <m.div
              key={link.to}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to={link.to} className="hover:text-accent-blue transition-colors">{link.text}</Link>
            </m.div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;