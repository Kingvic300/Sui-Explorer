

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';
import { useToastStore } from '../stores/useToastStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
    CodeIcon, 
    CurrencyDollarIcon, 
    UsersIcon, 
    AlertTriangleIcon,
    PlusIcon
} from '../components/icons/MiscIcons';
import SubmitProjectModal from '../components/ui/modals/SubmitProjectModal';
import SubmitCoinModal from '../components/ui/modals/SubmitCoinModal';
import SubmitAccountModal from '../components/ui/modals/SubmitAccountModal';
import SubmitScamModal from '../components/ui/modals/SubmitScamModal';
import { SubmissionCardProps, ProjectSubmissionData, CoinSubmissionData, AccountSubmissionData, ScamReportData } from '../types/index';

const submissionOptions = [
    {
        icon: CodeIcon,
        title: 'Submit Project',
        description: 'Let your project appear on Sui Explorer Directory, the most advanced directory on Sui:',
        points: ['Describe & publish your project', 'Link it with the blockchain data (packages, coins)'],
        buttonText: 'Submit',
        action: 'project'
    },
    {
        icon: CurrencyDollarIcon,
        title: 'Submit Coin',
        description: 'Increase the visibility of your coin:',
        points: [
            'Link your coin to an existing ecosystem project',
            'Get your coin verified and move it to the top',
            'Attach a ticker to fetch coin market price'
        ],
        buttonText: 'Submit',
        action: 'coin'
    },
    {
        icon: UsersIcon,
        title: 'Submit Account',
        description: 'Make your account stand out of the crowd:',
        points: [
            'Provide your logo and brand name',
            'Submit social contacts',
            'Add a description to let everyone know who you are'
        ],
        buttonText: 'Submit',
        action: 'account'
    },
    {
        icon: AlertTriangleIcon,
        title: 'Submit SCAM',
        description: 'Make a SCAM report:',
        points: [
            'Report an account that is behaving suspiciously (e.g. phishing link)',
            'Report a coin that looks like SCAM'
        ],
        buttonText: 'Submit',
        action: 'scam'
    }
];

const SubmissionCard: React.FC<SubmissionCardProps> = ({ icon: Icon, title, description, points, buttonText, onButtonClick }) => (
    <Card className="!p-6 h-full flex flex-col">
        <div className="flex-grow">
            <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-accent-indigo/10 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent-indigo" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white pt-2">{title}</h3>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-300 mb-3">{description}</p>
            <ul className="space-y-1.5 text-sm text-slate-800 dark:text-slate-300 list-disc list-inside">
                {points.map(point => <li key={point}>{point}</li>)}
            </ul>
        </div>
        <div className="mt-6">
            <Button variant="outline" className="w-full !py-2" onClick={onButtonClick}>
                <PlusIcon className="w-4 h-4 mr-2" />
                {buttonText}
            </Button>
        </div>
    </Card>
);


const SubmitProjectPage: React.FC = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    const handleProjectSubmit = async (data: ProjectSubmissionData) => {
        console.log("Submitting project:", { ...data, logo: `[Base64 Data]`, banner: `[Base64 Data]` });
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const handleCoinSubmit = async (data: CoinSubmissionData) => {
        console.log("Submitting coin:", { ...data, logo: `[Base64 Data]` });
        await new Promise(resolve => setTimeout(resolve, 1500));
    };
    
    const handleAccountSubmit = async (data: AccountSubmissionData) => {
        console.log("Submitting account:", { ...data, logo: `[Base64 Data]` });
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const handleScamSubmit = async (data: ScamReportData) => {
        console.log("Submitting scam report:", data);
        await new Promise(resolve => setTimeout(resolve, 1500));
    };

    const handleCardClick = (action: string) => {
        setActiveModal(action);
    };

    const handleCloseModal = () => {
        setActiveModal(null);
    }

    return (
        <>
            <m.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                <m.div
                    className="max-w-5xl mx-auto space-y-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <m.section 
                        variants={itemVariants} 
                        className="text-center p-8 md:p-12 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-dark-card dark:to-indigo-900/20"
                    >
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-slate-900 dark:text-white">Get Listed on Sui Explorer</h1>
                        <p className="text-slate-800 dark:text-slate-300 max-w-3xl mx-auto">
                            Submit the required off-chain info to help us show richer data and build more insightful analytics regarding you, your project, wallet, or coin.
                        </p>
                    </m.section>

                    <m.div variants={staggerContainer} className="grid md:grid-cols-2 gap-6">
                        {submissionOptions.map((option) => (
                            <m.div key={option.title} variants={itemVariants}>
                                <SubmissionCard 
                                    {...option}
                                    onButtonClick={() => handleCardClick(option.action)}
                                />
                            </m.div>
                        ))}
                    </m.div>
                </m.div>
            </m.div>

            {activeModal === 'project' && <SubmitProjectModal onClose={handleCloseModal} onSubmit={handleProjectSubmit} />}
            {activeModal === 'coin' && <SubmitCoinModal onClose={handleCloseModal} onSubmit={handleCoinSubmit} />}
            {activeModal === 'account' && <SubmitAccountModal onClose={handleCloseModal} onSubmit={handleAccountSubmit} />}
            {activeModal === 'scam' && <SubmitScamModal onClose={handleCloseModal} onSubmit={handleScamSubmit} />}
        </>
    );
};

export default SubmitProjectPage;