

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../../hooks/queries/useProjects';
import { CheckCircleIcon, XIcon, CurrencyDollarIcon } from '../../icons/MiscIcons';
import { fileToBase64, FormSection, FormInput, ImageUpload, FormSelect } from '../forms/FormElements';

export interface CoinSubmissionData {
    coinAddress: string;
    symbol: string;
    name: string;
    projectId: string;
    logo: string; // base64
}

interface SubmitCoinModalProps {
  onClose: () => void;
  onSubmit: (coin: CoinSubmissionData) => Promise<void>;
}

const SuccessScreen = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
         <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full bg-dark-card rounded-full flex items-center justify-center border-2 border-green-500/50">
                 <svg className="w-12 h-12 text-green-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="success-checkmark-icon" d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
        <h3 className="font-display text-2xl font-bold text-white">Submission Received!</h3>
        <p className="text-slate-300 mt-2">Your coin information is now under review. Thank you!</p>
    </div>
);

const modalContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};


const SubmitCoinModal: React.FC<SubmitCoinModalProps> = ({ onClose, onSubmit }) => {
    const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<CoinSubmissionData>({
        coinAddress: '',
        symbol: '',
        name: '',
        projectId: '',
        logo: '',
    });
    const [fileData, setFileData] = useState<{ logo?: File }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const modalRef = useRef<HTMLFormElement>(null);
    const logoUrlRef = useRef(formData.logo);
    logoUrlRef.current = formData.logo;

    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [isSubmitting, onClose]);
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.body.style.overflow = 'auto';
          document.removeEventListener('keydown', handleKeyDown);

          if (logoUrlRef.current && logoUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(logoUrlRef.current);
          }
        };
    }, [handleClose]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target as { id: 'logo', files: FileList | null };
        if (files && files[0]) {
            if (formData.logo.startsWith('blob:')) {
                URL.revokeObjectURL(formData.logo);
            }
            setFileData({ logo: files[0] });
            setFormData(prev => ({ ...prev, logo: URL.createObjectURL(files[0]) }));
            if (errors.logo) {
                setErrors(prev => ({ ...prev, logo: '' }));
            }
        }
    };

    const handleRemoveImage = (id: 'logo') => {
        if (formData[id] && formData[id].startsWith('blob:')) {
            URL.revokeObjectURL(formData[id]);
        }
        setFormData(prev => ({ ...prev, [id]: '' }));
        setFileData(prev => ({ ...prev, [id]: undefined }));
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.coinAddress.trim()) newErrors.coinAddress = 'Coin Address / Type is required.';
        else if (!formData.coinAddress.includes('::')) newErrors.coinAddress = 'Please enter a valid coin type (e.g., 0x2::sui::SUI).';
        if (!formData.symbol.trim()) newErrors.symbol = 'Coin Symbol is required.';
        if (!formData.name.trim()) newErrors.name = 'Coin Name is required.';
        if (!formData.projectId) newErrors.projectId = 'Please associate this coin with a project.';
        if (!formData.logo) newErrors.logo = 'Please upload a coin logo.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || isSuccess || !validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const logoData = fileData.logo ? await fileToBase64(fileData.logo) : formData.logo;
            
            // TODO: Replace this with your smart contract interaction logic.
            // This is the placeholder for your smart contract call to submit coin info.
            console.log("Submitting coin to smart contract with data:", {
                ...formData,
                logo: `[Base64 Data]`,
            });
            await onSubmit({ ...formData, logo: logoData });

            setIsSuccess(true);
            setTimeout(handleClose, 2500);
        } catch (error) {
            console.error("Submission failed", error);
            setErrors({ form: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const submitButtonClasses = `relative font-semibold py-3 px-5 rounded-lg transition-all duration-300 transform text-white overflow-hidden focus:outline-none flex items-center justify-center w-48 h-12 ${isSubmitting ? 'bg-indigo-700 cursor-wait' : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-blue-400'}`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
      <form onSubmit={handleFormSubmit} ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`modal-gradient-bg relative bg-dark-bg w-full max-w-lg max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 flex flex-col transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <AnimatePresence mode="wait">
            {isSuccess ? (
                <m.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex items-center justify-center">
                    <SuccessScreen />
                </m.div>
            ) : (
                <m.div 
                    key="form" 
                    variants={modalContentVariants}
                    initial="hidden" 
                    animate="visible" 
                    exit="exit" 
                    className="flex flex-col min-h-0 h-full"
                >
                    <div className="p-6 border-b border-dark-border flex-shrink-0">
                      <h2 id="modal-title" className="font-display text-2xl font-bold text-white">Submit Coin Information</h2>
                      <p className="text-slate-300 mt-1">Provide details to list your coin on the explorer.</p>
                      <button type="button" onClick={handleClose} aria-label="Close form" className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50" disabled={isSubmitting}>
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <FormSection title="Coin Details" icon={<CurrencyDollarIcon className="w-6 h-6 text-blue-400" />}>
                            <FormInput label="Coin Address / Type *" id="coinAddress" value={formData.coinAddress} onChange={handleInputChange} error={errors.coinAddress} placeholder="e.g., 0x2::sui::SUI" />
                            <FormInput label="Coin Symbol *" id="symbol" value={formData.symbol} onChange={handleInputChange} error={errors.symbol} placeholder="e.g., SUI" />
                            <FormInput label="Coin Name *" id="name" value={formData.name} onChange={handleInputChange} error={errors.name} placeholder="e.g., Sui Token" />
                             <FormSelect label="Associated Project *" id="projectId" value={formData.projectId} onChange={handleInputChange} error={errors.projectId}>
                                <option value="" disabled>{isLoadingProjects ? 'Loading projects...' : 'Select a project'}</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </FormSelect>
                            <ImageUpload label="Coin Logo *" id="logo" imageUrl={formData.logo} onRemove={() => handleRemoveImage('logo')} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, image/svg" recommendedSize="256x256px, 1:1 ratio" aspectRatioClass="aspect-square" error={errors.logo} />
                        </FormSection>
                        {errors.form && <p className="mt-4 text-sm text-red-400 text-center">{errors.form}</p>}
                    </div>

                    <div className="flex-shrink-0 p-6 border-t border-dark-border flex justify-end items-center bg-dark-bg/80">
                        <button 
                            type="submit" 
                            disabled={isSubmitting || isSuccess} 
                            className={submitButtonClasses}
                        >
                            {isSubmitting && <span className="absolute top-0 -left-full w-full h-full bg-white/10 blur-sm -skew-x-12 animate-shimmer" />}
                            <span className="relative z-10 flex items-center justify-center w-full h-full">
                                {isSubmitting ? <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>Submitting...</span>
                                               : 'Submit Coin'}
                            </span>
                        </button>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SubmitCoinModal;