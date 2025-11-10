

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { m } from 'framer-motion';
// FIX: Removed import from deprecated `data/utils.ts` and added local data fetching logic.
import { projectsData } from '../data/projects';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/projects/Breadcrumb';
import { pageVariants, pageTransition, staggerContainer, itemVariants as staggerItem } from '../utils/animations';
import LazyImage from '../components/ui/LazyImage';

// FIX: Re-implemented `getProductById` locally after it was removed from `data/utils.ts`.
const getProductById = (projectId: number, productId: string) => {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        return { project: undefined, product: undefined };
    }
    const product = project.products?.find(p => p.id === productId);
    return { project, product };
};

const ProductDetailPage: React.FC = () => {
    const { projectId, productId } = useParams<{ projectId: string; productId: string; }>();
    
    const { project, product } = getProductById(parseInt(projectId || '', 10), productId || '');

    if (!project || !product) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold">Product Not Found</h1>
                <p className="text-slate-500 mt-2">The product you're looking for doesn't exist.</p>
                <Link to={`/projects/${projectId || ''}`} className="mt-6 inline-block">
                    <Button variant="primary">Back to Project</Button>
                </Link>
            </div>
        );
    }

    return (
        <m.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
          <m.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <m.div variants={staggerItem}>
              <Breadcrumb project={project} product={product} />
            </m.div>

            <m.div variants={staggerItem} className="flex flex-col md:flex-row items-center gap-8">
                <LazyImage
                    src={product.logo}
                    alt={`${product.name} logo`}
                    className="w-full h-full object-contain"
                    wrapperClassName="w-24 h-24 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg flex-shrink-0"
                    loading="lazy"
                />
                <div className="min-w-0">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full mb-2 inline-block ${
                        product.status === 'Mainnet' ? 'bg-green-500/20 text-green-400' :
                        product.status === 'Testnet' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-500/20 text-slate-400'
                    }`}>{product.status}</span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white break-words">{product.name}</h1>
                    <p className="text-slate-800 dark:text-slate-300 text-lg break-words">{product.type}</p>
                </div>
            </m.div>

            <m.div variants={staggerContainer} className="grid lg:grid-cols-3 gap-6 items-start">
                <m.div variants={staggerItem} className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-bold mb-3">About {product.name}</h2>
                        <p className="text-slate-900 dark:text-slate-200 leading-relaxed break-words">{product.description}</p>
                    </Card>
                </m.div>
                <m.div variants={staggerItem} className="lg:col-span-1 space-y-6 self-start sticky top-24">
                   {(product.packages && product.packages.length > 0) || product.token ? (
                        <Card>
                            <h3 className="font-bold mb-4 text-lg">Technical Details</h3>
                            <div className="space-y-6">
                                {product.packages && product.packages.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-200">Packages & Modules</h4>
                                        <ul className="space-y-2">
                                            {product.packages.map((pkg) => (
                                                <li key={pkg.name}>
                                                    <a href={pkg.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-blue hover:underline">{pkg.name}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {product.token && (
                                   <div>
                                       <h4 className="font-semibold mb-2 text-slate-900 dark:text-slate-200">Token Info</h4>
                                       <div className="space-y-2 text-sm">
                                           <div className="flex justify-between">
                                               <span className="text-slate-800 dark:text-slate-300">Symbol:</span>
                                               <span className="font-semibold">{product.token.symbol}</span>
                                           </div>
                                            <div className="flex justify-between">
                                               <span className="text-slate-800 dark:text-slate-300">Supply:</span>
                                               <span className="font-semibold">{product.token.supply}</span>
                                           </div>
                                       </div>
                                   </div>
                                )}
                            </div>
                        </Card>
                   ) : null}
                </m.div>
            </m.div>
          </m.div>
        </m.div>
    );
};

export default ProductDetailPage;