import React from 'react';
import { m } from 'framer-motion';
import Card from '../ui/Card';
import ProjectProductListItem from './ProjectProductListItem';
// FIX: Corrected import path for Product type.
import { Product } from '@/types/index.ts';
import { itemVariants } from '@/utils/animations';

interface ProjectProductsCardProps {
  products: Product[];
  projectId: number;
}

const ProjectProductsCard: React.FC<ProjectProductsCardProps> = ({ products, projectId }) => {
  return (
    <m.div variants={itemVariants}>
      <Card>
        <h2 className="text-xl font-bold mb-4">Products & Packages</h2>
        <div className="space-y-3">
          {products.map(product => (
            <ProjectProductListItem
              key={product.id}
              product={product}
              projectId={projectId}
            />
          ))}
        </div>
      </Card>
    </m.div>
  );
};

export default ProjectProductsCard;