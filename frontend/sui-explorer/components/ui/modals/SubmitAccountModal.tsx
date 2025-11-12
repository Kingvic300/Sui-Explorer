import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XIcon, UsersIcon, GlobeIcon, TwitterIcon } from '../../icons/MiscIcons';
import { fileToBase64, FormSection, FormInput, FormTextarea, ImageUpload } from '../forms/FormElements';

export interface AccountSubmissionData {
    address: string;
    name: string;
    description: string;
    url?: string;
    twitter?: string;
    logo: string; // base64
}

interface SubmitAccountModalProps {
    onClose: () => void;
    onSubmit: (account: AccountSubmissionData) => Promise<void>;
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Submission Received!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
            Your account information is now under review. Thank you!
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
    icon?: React.ReactNode;
}> = ({ label, id, value, onChange, type = 'text', placeholder, required, error, maxLength, icon }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {icon}
                </div>
            )}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    icon ? 'pl-10' : 'pl-3'
                } ${
                    error
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 placeholder-red-300'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
        </div>
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
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none ${
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

const SubmitAccountModal: React.FC<SubmitAccountModalProps> = ({ onClose, onSubmit }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<AccountSubmissionData>({
        address: '',
        name: '',
        description: '',
        url: '',
        twitter: '',
        logo: '',
    });
    const [fileData, setFileData] = useState<{ logo?: File }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const modalRef = useRef<HTMLFormElement>(null);
    const logoUrlRef = useRef(formData.logo);

    // Update refs when formData changes
    useEffect(() => {
        logoUrlRef.current = formData.logo;
    }, [formData.logo]);

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

            if (logoUrlRef.current?.startsWith('blob:')) {
                URL.revokeObjectURL(logoUrlRef.current);
            }
        };
    }, [handleClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target as { id: 'logo', files: FileList | null };
        if (files && files[0]) {
            if (formData.logo.startsWith('blob:')) URL.revokeObjectURL(formData.logo);
            setFileData({ logo: files[0] });
            setFormData(prev => ({ ...prev, logo: URL.createObjectURL(files[0]) }));
            if (errors.logo) setErrors(prev => ({ ...prev, logo: '' }));
        }
    };

    const handleRemoveImage = (id: 'logo') => {
        if (formData[id]?.startsWith('blob:')) {
            URL.revokeObjectURL(formData[id]);
        }
        setFormData(prev => ({ ...prev, [id]: '' }));
        setFileData(prev => ({ ...prev, [id]: undefined }));
    };

    const validateUrl = (urlString: string, fieldName: string): string | undefined => {
        if (!urlString) return undefined;
        try {
            new URL(urlString);
        } catch (_) {
            return `Please enter a valid URL for ${fieldName}.`;
        }
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.address.trim()) newErrors.address = 'Account Address is required.';
        else if (!formData.address.startsWith('0x') || formData.address.length < 10) newErrors.address = 'Please enter a valid Sui address.';
        if (!formData.name.trim()) newErrors.name = 'Brand Name / Alias is required.';
        if (!formData.description.trim()) newErrors.description = 'Description is required.';
        if (!formData.logo) newErrors.logo = 'Please upload a logo.';

        const urlError = validateUrl(formData.url || '', 'Website URL');
        if (urlError) newErrors.url = urlError;
        const twitterError = validateUrl(formData.twitter || '', 'X (Twitter) URL');
        if (twitterError) newErrors.twitter = twitterError;

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

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <form
                onSubmit={handleFormSubmit}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`relative bg-white dark:bg-gray-900 w-full max-w-xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}
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
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                                                Submit Account Information
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                                Help others identify your account on the explorer.
                                            </p>
                                        </div>
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

                            {/* Form Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <UsersIcon className="w-5 h-5 text-blue-500" />
                                        Account Details
                                    </h3>

                                    <CustomFormInput
                                        label="Account Address"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        error={errors.address}
                                        placeholder="0x2a1b3c4d5e6f..."
                                        required
                                    />
                                    <CustomFormInput
                                        label="Brand Name / Alias"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={errors.name}
                                        placeholder="e.g., My Cool Project"
                                        required
                                    />
                                    <CustomFormTextarea
                                        label="Description"
                                        id="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        error={errors.description}
                                        placeholder="A brief description of this account's purpose and what it represents..."
                                        rows={3}
                                        required
                                    />
                                    <CustomFormInput
                                        label="Website URL"
                                        id="url"
                                        type="url"
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        error={errors.url}
                                        placeholder="https://example.com"
                                        icon={<GlobeIcon className="w-4 h-4" />}
                                    />
                                    <CustomFormInput
                                        label="X (Twitter) URL"
                                        id="twitter"
                                        type="url"
                                        value={formData.twitter}
                                        onChange={handleInputChange}
                                        error={errors.twitter}
                                        placeholder="https://x.com/yourhandle"
                                        icon={<TwitterIcon className="w-4 h-4" />}
                                    />

                                    <ImageUpload
                                        label="Logo / Avatar"
                                        id="logo"
                                        imageUrl={formData.logo}
                                        onRemove={() => handleRemoveImage('logo')}
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg, image/gif, image/webp"
                                        recommendedSize="256x256px, 1:1 ratio"
                                        aspectRatioClass="aspect-square"
                                        error={errors.logo}
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
                                    className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
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
                                        'Submit Account'
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

export default SubmitAccountModal;