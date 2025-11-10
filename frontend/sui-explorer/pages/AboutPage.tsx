import React from 'react';
import { m } from 'framer-motion';
import Card from '../components/ui/Card';
import { UsersIcon, ZapIcon, GlobeIcon } from '../components/icons/MiscIcons';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';
import LazyImage from '../components/ui/LazyImage';

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Lead Architect',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    bio: 'A passionate architect of decentralized systems, building the scalable and secure backbone of the Sui Explorer.',
  },
  {
    name: 'Jane Doe',
    role: 'Head of Product & Design',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    bio: 'Crafting intuitive and beautiful experiences that empower users to navigate the complex world of Web3 with ease.',
  },
  {
    name: 'Sam Wilson',
    role: 'Ecosystem & Community Lead',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    bio: 'Fostering a vibrant and inclusive community, connecting the builders and dreamers of the Sui ecosystem.',
  },
];

const AboutPage: React.FC = () => {
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
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">The Compass for a New Digital Frontier</h1>
                <p className="text-slate-900 dark:text-slate-200 max-w-3xl mx-auto">
                Sui Explorer is more than a directory; it's a living map of a burgeoning digital nation, built to empower its citizens—the builders, creators, and users of the Sui blockchain.
                </p>
            </m.section>

            <m.section variants={staggerContainer} className="grid md:grid-cols-2 gap-8 items-center">
                <m.div variants={itemVariants}>
                    <h2 className="text-3xl font-display font-bold mb-4">Our Mission: Clarity in Chaos</h2>
                    <p className="text-slate-900 dark:text-slate-200 mb-4 leading-relaxed">
                        The world of Web3 is exciting but fragmented. Our mission is to bring clarity and order to the Sui ecosystem, creating a central hub that is both powerful for developers and welcoming for newcomers. We're here to illuminate the landscape of dApps, projects, and opportunities, fostering transparency, discovery, and explosive growth.
                    </p>
                    <p className="text-slate-900 dark:text-slate-200 leading-relaxed">
                        We are relentlessly dedicated to providing real-time data, unbiased insights, and a platform for genuine community engagement. By arming users with the right tools, we believe we can accelerate the adoption of Sui and the decentralized future it represents.
                    </p>
                </m.div>
                <m.div variants={itemVariants} className="relative flex justify-center items-center h-64">
                    <div className="absolute w-64 h-64 bg-accent-blue/20 dark:bg-accent-blue/30 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute w-48 h-48 bg-accent-indigo/20 dark:bg-accent-indigo/30 rounded-full blur-2xl animate-float animation-delay-3000 right-0"></div>
                    <GlobeIcon className="w-48 h-48 text-accent-blue opacity-20" />
                </m.div>
            </m.section>

            <m.section variants={staggerContainer} className="text-center">
                <m.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display font-bold mb-10">The Cartographers</m.h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                    <m.div variants={itemVariants} key={member.name}>
                        <Card className="text-center h-full">
                            <LazyImage
                                src={member.avatar}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover"
                                wrapperClassName="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-light-bg dark:border-dark-card"
                                loading="lazy"
                            />
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-accent-blue text-sm mb-2">{member.role}</p>
                        <p className="text-slate-800 dark:text-slate-300 text-sm break-words">{member.bio}</p>
                        </Card>
                    </m.div>
                ))}
                </div>
            </m.section>
            
            <m.section variants={staggerContainer} className="text-center">
                <m.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display font-bold mb-4">Our Core Principles</m.h2>
                <m.p variants={itemVariants} className="text-slate-900 dark:text-slate-200 max-w-2xl mx-auto mb-10">The values that guide our every decision.</m.p>
                <div className="grid md:grid-cols-3 gap-6">
                    <m.div variants={itemVariants}><Card className="h-full"><UsersIcon className="w-8 h-8 mb-4 text-accent-blue mx-auto" /><h3 className="font-bold text-lg mb-2">Community First</h3><p className="text-sm text-slate-800 dark:text-slate-300">We build for and with our community. Your voice shapes our roadmap. Period.</p></Card></m.div>
                    <m.div variants={itemVariants}><Card className="h-full"><ZapIcon className="w-8 h-8 mb-4 text-accent-blue mx-auto" /><h3 className="font-bold text-lg mb-2">Radical Transparency</h3><p className="text-sm text-slate-800 dark:text-slate-300">Clear, accurate, and on-chain data is the bedrock of trust. We present the ground truth.</p></Card></m.div>
                    <m.div variants={itemVariants}><Card className="h-full"><GlobeIcon className="w-8 h-8 mb-4 text-accent-blue mx-auto" /><h3 className="font-bold text-lg mb-2">Permissionless Innovation</h3><p className="text-sm text-slate-800 dark:text-slate-300">We champion the open-source ethos and support the builders shaping the future of Sui.</p></Card></m.div>
                </div>
            </m.section>
        </m.div>
    </m.div>
  );
};

export default AboutPage;