
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XIcon, AlertTriangleIcon } from '../../icons/MiscIcons';
import { FormSection, FormInput, FormTextarea } from '../forms/FormElements';

export interface ScamReportData {
    type: 'Account' | 'Coin';
    address: string;
    reason: string;
    evidenceUrl?: string;
}

interface SubmitScamModalProps {
  onClose: () => void;
  onSubmit: (report: ScamReportData) => Promise<void>;
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
        <h3 className="font-display text-2xl font-bold text-white">Report Received</h3>
        <p className="text-slate-300 mt-2">Thank you for helping keep the Sui ecosystem safe. Our team will review your report shortly.</p>
    </div>
);

const modalContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};


const SubmitScamModal: React.FC<SubmitScamModalProps> = ({ onClose, onSubmit }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<ScamReportData>({
        type: 'Account',
        address: '',
        reason: '',
        evidenceUrl: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const modalRef = useRef<HTMLFormElement>(null);

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
        };
    }, [handleClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as 'Account' | 'Coin' }));
    };
    
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.address.trim()) newErrors.address = 'Address or Coin Type is required.';
        if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason for the report.';
        if (formData.evidenceUrl) {
            try {
                new URL(formData.evidenceUrl);
            } catch (_) {
                newErrors.evidenceUrl = 'Please enter a valid URL.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || isSuccess || !validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            // This is the placeholder for your backend API call.
            // A scam report should likely go to a centralized service for review, not a smart contract.
            // e.g., await fetch('/api/report-scam', { method: 'POST', body: JSON.stringify(formData) });
            console.log("Submitting scam report to backend API:", formData);
            await onSubmit(formData);

            setIsSuccess(true);
            setTimeout(handleClose, 2500);
        } catch (error) {
            console.error("Submission failed", error);
            setErrors({ form: 'An unexpected error occurred while submitting the report. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const submitButtonClasses = `relative font-semibold py-3 px-5 rounded-lg transition-all duration-300 transform text-white overflow-hidden focus:outline-none flex items-center justify-center w-48 h-12 ${isSubmitting ? 'bg-red-800 cursor-wait' : 'bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-red-400'}`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
      <form onSubmit={handleFormSubmit} ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`modal-gradient-bg relative bg-dark-bg w-full max-w-lg max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10 flex flex-col transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
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
                      <h2 id="modal-title" className="font-display text-2xl font-bold text-white">Report Scam</h2>
                      <p className="text-slate-300 mt-1">Help protect the community by reporting suspicious activity.</p>
                      <button type="button" onClick={handleClose} aria-label="Close form" className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50" disabled={isSubmitting}>
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <FormSection title="Report Details" icon={<AlertTriangleIcon className="w-6 h-6 text-red-400" />}>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                                    <input type="radio" name="type" value="Account" checked={formData.type === 'Account'} onChange={handleRadioChange} className="form-radio bg-dark-bg border-dark-border text-accent-blue focus:ring-accent-blue" />
                                    Account
                                </label>
                                 <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                                    <input type="radio" name="type" value="Coin" checked={formData.type === 'Coin'} onChange={handleRadioChange} className="form-radio bg-dark-bg border-dark-border text-accent-blue focus:ring-accent-blue" />
                                    Coin
                                </label>
                            </div>
                            <FormInput label={`${formData.type} Address / Type *`} id="address" value={formData.address} onChange={handleInputChange} error={errors.address} placeholder={formData.type === 'Account' ? '0x...' : '0x2::sui::SUI'} />
                            <FormTextarea label="Reason for Report *" id="reason" value={formData.reason} onChange={handleInputChange} error={errors.reason} placeholder="e.g., Phishing link in bio, impersonation, rug pull..." rows={4} />
                            <FormInput label="URL with Evidence (Optional)" id="evidenceUrl" type="url" value={formData.evidenceUrl} onChange={handleInputChange} error={errors.evidenceUrl} placeholder="e.g., Link to X post, website..." />
                        </FormSection>
                        {errors.form && <p className="mt-4 text-sm text-red-400 text-center">{errors.form}</p>}
                    </div>

                    <div className="flex-shrink-0 p-6 border-t border-dark-border flex justify-end items-center bg-dark-bg/80">
                        <button type="submit" disabled={isSubmitting || isSuccess} className={submitButtonClasses}>
                            {isSubmitting && <span className="absolute top-0 -left-full w-full h-full bg-white/10 blur-sm -skew-x-12 animate-shimmer" />}
                            <span className="relative z-10 flex items-center justify-center w-full h-full">
                                {isSubmitting ? <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>Submitting...</span>
                                               : 'Submit Report'}
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

export default SubmitScamModal;
