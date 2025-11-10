

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import LazyImage from './LazyImage';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
};

const builders = [
    {
        name: 'Sui Foundation',
        role: 'Ecosystem Growth',
        avatar: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sui.svg',
        quote: "Fostering the growth and adoption of the Sui network through grants, community engagement, and strategic initiatives.",
    },
    {
        name: 'Mysten Labs',
        role: 'Core Contributors',
        avatar: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sui.svg',
        quote: "Building the foundational infrastructure for the next generation of decentralized applications on Sui.",
    },
    {
        name: 'Sui Daily',
        role: 'Community Hub',
        avatar: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/generic.svg',
        quote: "Providing the latest news, insights, and analysis on the Sui ecosystem to keep the community informed and engaged.",
    },
];

const SpotlightSection: React.FC = () => {
    return (
        <motion.section 
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display font-bold mb-4">Builder Spotlight</motion.h2>
            <motion.p variants={itemVariants} className="text-slate-900 dark:text-slate-200 max-w-2xl mx-auto mb-12">
                Meet the teams and individuals pushing the boundaries of what's possible on Sui.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8">
                {builders.map((builder) => (
                    <motion.div variants={itemVariants} key={builder.name}>
                        <Card className="text-center h-full">
                            <div className="w-20 h-20 rounded-full mx-auto mb-4 p-2 bg-light-bg dark:bg-dark-bg">
                                <LazyImage
                                    src={builder.avatar}
                                    alt={builder.name}
                                    className="w-full h-full rounded-full object-contain"
                                    wrapperClassName="w-full h-full rounded-full"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="font-bold text-lg">{builder.name}</h3>
                            <p className="text-accent-blue text-sm mb-3">{builder.role}</p>
                            <p className="text-slate-800 dark:text-slate-300 text-sm italic">"{builder.quote}"</p>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <motion.div variants={itemVariants} className="mt-12">
                <Button variant="outline">View All Builders</Button>
            </motion.div>
        </motion.section>
    );
};

export default SpotlightSection;