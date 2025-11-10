

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { EnrichedProduct } from '../../types/index';
import LazyImage from '../ui/LazyImage';

interface ProductCardProps {
  product: EnrichedProduct;
  showProjectInfo?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, showProjectInfo = false }) => (
    <Card className="!p-0 flex flex-col h-full">
        <div className="p-6 flex-grow">
            <div className="flex items-start mb-4">
                <LazyImage
                    src={product.logo}
                    alt={`${product.name} logo`}
                    className="w-full h-full object-contain"
                    wrapperClassName="w-12 h-12 bg-light-border dark:bg-dark-border rounded-lg mr-4 flex-shrink-0"
                    loading="lazy"
                />
                <div className="min-w-0">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white break-words">{product.name}</h4>
                    {showProjectInfo ? (
                         <p className="text-xs text-slate-800 dark:text-slate-300">
                           from <Link to={`/projects/${product.projectId}`} className="font-semibold hover:underline text-accent-blue">{product.projectName}</Link>
                         </p>
                    ) : (
                         <p className="text-sm text-slate-800 dark:text-slate-300">{product.type}</p>
                    )}
                </div>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-300 mb-4 line-clamp-3 break-words">{product.description}</p>
        </div>
        <div className="border-t border-light-border dark:border-dark-border p-4 mt-auto flex justify-between items-center">
             <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                product.status === 'Mainnet' ? 'bg-green-500/20 text-green-400' :
                product.status === 'Testnet' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-slate-500/20 text-slate-400'
            }`}>{product.status}</span>
            <Link to={`/projects/${product.projectId}/${product.id}`}>
                <Button variant="secondary" className="!py-1.5 !px-4 !text-xs">
                    View Product
                </Button>
            </Link>
        </div>
    </Card>
));

export default ProductCard;