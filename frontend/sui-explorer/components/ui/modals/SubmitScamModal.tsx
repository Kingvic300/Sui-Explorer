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
        <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-green-500/50 shadow-lg">
                <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report Received</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
            Thank you for helping keep the Sui ecosystem safe. Our team will review your report shortly.
        </p>
    </div>
);

const modalContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

// Custom form components with proper styling
const CustomFormInput: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    maxLength?: number;
}> = ({ label, id, value, onChange, type = 'text', placeholder, required, error, maxLength }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 ${
                error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 placeholder-red-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
            <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {maxLength && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {value.length}/{maxLength} characters
            </p>
        )}
    </div>
);

const CustomFormTextarea: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    rows?: number;
    maxLength?: number;
}> = ({ label, id, value, onChange, placeholder, required, error, rows = 3, maxLength }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
            id={id}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 resize-none ${
                error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 placeholder-red-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
            <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {maxLength && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {value.length}/{maxLength} characters
            </p>
        )}
    </div>
);

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

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
            <form
                onSubmit={handleFormSubmit}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`relative bg-white dark:bg-gray-900 w-full max-w-lg max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}
            >
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <m.div
                            key="success"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex items-center justify-center"
                        >
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
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                                            Report Scam
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                            Help protect the community by reporting suspicious activity.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        aria-label="Close form"
                                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <AlertTriangleIcon className="w-5 h-5 text-red-500" />
                                        Report Details
                                    </h3>

                                    {/* Radio Buttons */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Report Type
                                        </label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 text-gray-900 dark:text-white cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Account"
                                                    checked={formData.type === 'Account'}
                                                    onChange={handleRadioChange}
                                                    className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500 focus:ring-2"
                                                />
                                                Account
                                            </label>
                                            <label className="flex items-center gap-2 text-gray-900 dark:text-white cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Coin"
                                                    checked={formData.type === 'Coin'}
                                                    onChange={handleRadioChange}
                                                    className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500 focus:ring-2"
                                                />
                                                Coin
                                            </label>
                                        </div>
                                    </div>

                                    <CustomFormInput
                                        label={`${formData.type} Address / Type`}
                                        id="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        error={errors.address}
                                        placeholder={formData.type === 'Account' ? '0x...' : '0x2::sui::SUI'}
                                        required
                                    />
                                    <CustomFormTextarea
                                        label="Reason for Report"
                                        id="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        error={errors.reason}
                                        placeholder="e.g., Phishing link in bio, impersonation, rug pull..."
                                        rows={4}
                                        required
                                    />
                                    <CustomFormInput
                                        label="URL with Evidence (Optional)"
                                        id="evidenceUrl"
                                        type="url"
                                        value={formData.evidenceUrl}
                                        onChange={handleInputChange}
                                        error={errors.evidenceUrl}
                                        placeholder="e.g., Link to X post, website..."
                                    />
                                </div>

                                {errors.form && (
                                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                            {errors.form}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center bg-white dark:bg-gray-900">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isSuccess}
                                    className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    className="opacity-25"
                                                ></circle>
                                                <path
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    className="opacity-75"
                                                ></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Report'
                                    )}
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