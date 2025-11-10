

import React from 'react';
import { m } from 'framer-motion';
import Card from '../components/ui/Card';
import { SearchIcon, TrendingUpIcon, UsersIcon, CodeIcon, ZapIcon, GlobeIcon } from '../components/icons/MiscIcons';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';

const features = [
  {
    icon: SearchIcon,
    title: 'Smart Search & Filters',
    description: 'Effortlessly find dApps by category, tags, or performance metrics with our advanced filtering system. Our powerful search helps you pinpoint the exact project you\'re looking for in seconds.',
  },
  {
    icon: TrendingUpIcon,
    title: 'Real-Time Insights',
    description: 'Access up-to-date analytics, user activity, and on-chain data to make informed decisions. We track TVL, user growth, transaction volume, and more, presented in easy-to-understand charts.',
  },
  {
    icon: UsersIcon,
    title: 'Community Reviews',
    description: 'Leverage crowd-sourced wisdom with genuine user reviews and ratings for every project. Share your own experiences to help guide others and foster a transparent ecosystem.',
  },
  {
    icon: CodeIcon,
    title: 'Developer Submissions',
    description: 'A streamlined process for developers to submit their projects and gain visibility. Our platform provides the tools to showcase your work to a broad audience of Sui enthusiasts.',
  },
  {
    icon: ZapIcon,
    title: 'Ecosystem Pulse',
    description: 'Stay on top of the latest news and conversations from around the web with our curated community feed. We aggregate important updates and discussions from X, blogs, and more.',
  },
  {
    icon: GlobeIcon,
    title: 'Comprehensive Project Profiles',
    description: 'Dive deep into detailed project pages featuring descriptions, key stats, social links, and community reviews. Everything you need to know about a project, all in one place.',
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <m.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
        <m.div
            className="space-y-14"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <m.section variants={itemVariants} className="text-center">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Platform Features</h1>
                <p className="text-slate-900 dark:text-slate-200 max-w-3xl mx-auto">
                Sui Explorer is packed with powerful tools and features designed to give you a comprehensive and insightful view of the ecosystem.
                </p>
            </m.section>

            <m.section variants={staggerContainer}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <m.div variants={itemVariants} key={index}>
                    <Card className="flex flex-col h-full">
                        <div className="flex-grow">
                        <feature.icon className="w-10 h-10 mb-4 text-accent-blue" />
                        <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-800 dark:text-slate-300 break-words">
                            {feature.description}
                        </p>
                        </div>
                    </Card>
                    </m.div>
                ))}
                </div>
            </m.section>

            <m.section variants={itemVariants} className="text-center bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-8 md:p-10">
                <h2 className="text-3xl font-display font-bold mb-4">And We're Just Getting Started</h2>
                <p className="text-slate-900 dark:text-slate-200 max-w-2xl mx-auto">
                Our roadmap is filled with exciting new features, including advanced developer tools, personalized dashboards, and deeper on-chain analytics. Stay tuned for what's next!
                </p>
            </m.section>
        </m.div>
    </m.div>
  );
};

export default FeaturesPage;