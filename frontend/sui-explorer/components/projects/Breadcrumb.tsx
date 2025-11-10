import React from 'react';
import { Link } from 'react-router-dom';
import { Project, Product } from '../../types/index';
import { ChevronRightIcon } from '../icons/MiscIcons';

interface BreadcrumbProps {
  project?: Project;
  product?: Product;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ project, product }) => {
  return (
    <nav className="flex items-center text-sm text-slate-800 dark:text-slate-300 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link to="/projects" className="hover:text-accent-blue transition-colors">Projects</Link>
        </li>
        {project && (
          <li {...(!product && { 'aria-current': 'page' })}>
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4" />
              {product ? (
                <Link to={`/projects/${project.id}`} className="ml-1 hover:text-accent-blue transition-colors">
                  {project.name}
                </Link>
              ) : (
                <span className="ml-1 font-medium text-slate-900 dark:text-slate-100">
                  {project.name}
                </span>
              )}
            </div>
          </li>
        )}
        {product && (
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4" />
              <span className="ml-1 font-medium text-slate-900 dark:text-slate-100">
                {product.name}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;