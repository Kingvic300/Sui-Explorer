import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import LazyImage from '../ui/LazyImage';
// FIX: Corrected import path for Product type.
import { Product } from '../../types/index';
import { ChevronRightIcon } from '../icons/MiscIcons';

interface ProjectProductListItemProps {
  product: Product;
  projectId: number;
}

const ProjectProductListItem: React.FC<ProjectProductListItemProps> = ({ product, projectId }) => {
  return (
    <m.div
      className="rounded-lg border border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/50 transition-all duration-300 hover:border-accent-blue/50 hover:bg-light-bg dark:hover:bg-dark-bg/80 group"
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300 } }}
    >
      <Link to={`/projects/${projectId}/${product.id}`} className="block p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3 min-w-0">
            <LazyImage
              src={product.logo}
              alt={`${product.name} logo`}
              wrapperClassName="w-10 h-10 rounded-lg bg-light-card dark:bg-dark-card p-1 flex-shrink-0"
              className="object-contain"
            />
            <div className="min-w-0 flex-grow">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                    <p className="text-sm text-slate-800 dark:text-slate-300">{product.type}</p>
                 </div>
                 <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-2 hidden sm:inline-block ${ product.status === 'Mainnet' ? 'bg-green-500/20 text-green-400' : product.status === 'Testnet' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{product.status}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 line-clamp-2 break-words">{product.description}</p>
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-accent-blue transition-colors flex-shrink-0 ml-4" />
        </div>
      </Link>
    </m.div>
  );
};

export default ProjectProductListItem;