import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Project } from '../../../types/index';
import ProjectCard from '../ProjectCard';
import { CheckIcon, XIcon, DiscordIcon, GlobeIcon, GitHubIcon } from '../../icons/MiscIcons';
import { fileToBase64, FormSection, FormInput, FormTextarea, ImageUpload, FormSelect } from '../forms/FormElements';

type ProjectCategory = 'DeFi' | 'Gaming' | 'NFT' | 'Infrastructure';
const categories: ProjectCategory[] = ['DeFi', 'Gaming', 'NFT', 'Infrastructure'];

export interface ProjectSubmissionData {
    name: string;
    tagline: string;
    description: string;
    category: ProjectCategory;
    url: string;
    twitter?: string;
    discord?: string;
    github?: string;
    logo: string; // base64
    banner: string; // base64
}

interface SubmitProjectModalProps {
    onClose: () => void;
    onSubmit: (project: ProjectSubmissionData) => Promise<void>;
}

const steps = ['Project Details', 'Links & Visuals', 'Review & Submit'];

// Enhanced Step Indicator with better accessibility
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex items-center justify-between mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
        {steps.map((title, index) => {
            const step = index + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            return (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center text-center w-1/3 z-10">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2 ${
                                isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : isActive
                                        ? 'bg-blue-500 border-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-300 border-gray-400 dark:bg-gray-700 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                            }`}
                            aria-current={isActive ? 'step' : undefined}
                        >
                            {isCompleted ? <CheckIcon className="w-4 h-4" /> : step}
                        </div>
                        <p className={`mt-2 text-xs font-medium transition-colors truncate ${
                            isActive || isCompleted
                                ? 'text-gray-900 dark:text-white font-semibold'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}>
                            {title}
                        </p>
                    </div>
                    {step < steps.length && (
                        <div className={`flex-1 h-1 -mt-4 mx-2 rounded bg-gray-300 dark:bg-gray-700`}>
                            <div className={`h-full rounded transition-all duration-500 ${
                                isCompleted
                                    ? 'w-full bg-green-500'
                                    : (isActive
                                        ? 'w-1/2 bg-blue-500'
                                        : 'w-0 bg-transparent')
                            }`} />
                        </div>
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

const ReviewItem: React.FC<{ label: string; value?: string | React.ReactNode }> = ({ label, value }) => (
    <div className="py-2">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</h4>
        <div className="text-gray-900 dark:text-white break-words text-sm">
            {value || <span className="text-gray-500 dark:text-gray-400 italic">Not provided</span>}
        </div>
    </div>
);

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
            Your project is now under review. Thank you for contributing to the Sui ecosystem.
        </p>
    </div>
);

// Enhanced Preview Section with better state management
const PreviewSection: React.FC<{ project: Project }> = ({ project }) => {
    const hasMissingFields = project.name === 'Project Name' ||
        project.tagline === 'Your catchy tagline.' ||
        !project.logo ||
        !project.banner;

    return (
        <div className="sticky top-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Live Preview
                </h3>

                {/* Preview Card */}
                <div className="relative group">
                    <div className="transform scale-90 origin-top">
                        <ProjectCard
                            project={project}
                            index={0}
                            onSelect={() => {}}
                            isFavorite={false}
                            onToggleFavorite={() => {}}
                            user={null}
                            onAuthRequired={() => {}}
                        />
                    </div>

                    {/* Preview Overlay */}
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-[1px] rounded-xl flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600">
                                PREVIEW MODE
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                This is how your project will appear
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview Status */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Preview updates in real-time</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        Changes you make will instantly update the preview
                    </p>
                </div>

                {/* Missing Fields Warning */}
                {hasMissingFields && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="font-medium">Complete all fields</span>
                        </div>
                        <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                            Fill in all required fields to see the final preview
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Enhanced Custom Form Components with better error handling
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

const CustomFormSelect: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}> = ({ label, id, value, onChange, required, error, children }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        >
            {children}
        </select>
        {error && (
            <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
    </div>
);

const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({ onClose, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<ProjectSubmissionData>({
        name: '',
        tagline: '',
        description: '',
        category: 'DeFi',
        url: '',
        twitter: '',
        discord: '',
        github: '',
        logo: '',
        banner: '',
    });
    const [fileData, setFileData] = useState<{ logo?: File; banner?: File }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const modalRef = useRef<HTMLFormElement>(null);
    const logoUrlRef = useRef(formData.logo);
    const bannerUrlRef = useRef(formData.banner);

    // Update refs when formData changes
    useEffect(() => {
        logoUrlRef.current = formData.logo;
        bannerUrlRef.current = formData.banner;
    }, [formData.logo, formData.banner]);

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
            if (bannerUrlRef.current?.startsWith('blob:')) {
                URL.revokeObjectURL(bannerUrlRef.current);
            }
        };
    }, [handleClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value as any }));
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target as { id: 'logo' | 'banner', files: FileList | null };
        if (files && files[0]) {
            const file = files[0];

            // Clean up previous blob URLs
            if (formData[id]?.startsWith('blob:')) {
                URL.revokeObjectURL(formData[id]);
            }

            setFileData(prev => ({ ...prev, [id]: file }));
            setFormData(prev => ({...prev, [id]: URL.createObjectURL(file) }));
            if (errors[id]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[id];
                    return newErrors;
                });
            }
        }
    };

    const handleRemoveImage = (id: 'logo' | 'banner') => {
        if (formData[id]?.startsWith('blob:')) {
            URL.revokeObjectURL(formData[id]);
        }
        setFormData(prev => ({ ...prev, [id]: '' }));
        setFileData(prev => ({ ...prev, [id]: undefined }));
    };

    const validateUrl = (urlString: string, fieldName: string): string | undefined => {
        if (!urlString) return undefined;
        try {
            const url = new URL(urlString);
            if (!['http:', 'https:'].includes(url.protocol)) {
                return `${fieldName} must start with http:// or https://.`;
            }
            if (!url.hostname || !url.hostname.includes('.')) {
                return `Please enter a valid domain for ${fieldName}.`;
            }
        } catch (_) {
            return `Please enter a valid URL for ${fieldName}.`;
        }
        return undefined;
    };

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Project Name is required.';
            if (!formData.tagline.trim()) newErrors.tagline = 'Tagline is required.';
            if (formData.tagline.length > 100) newErrors.tagline = 'Tagline must be 100 characters or less.';
            if (!formData.description.trim()) newErrors.description = 'Description is required.';
            if (formData.description.length > 500) newErrors.description = 'Description must be 500 characters or less.';
            if (!formData.category) newErrors.category = 'Please select a category.';
        } else if (step === 2) {
            const urlError = validateUrl(formData.url, "Project Website");
            if (urlError) newErrors.url = urlError;
            else if (!formData.url.trim()) newErrors.url = "Project Website is required.";

            if (formData.twitter) {
                const twitterError = validateUrl(formData.twitter, "X (Twitter) URL");
                if (twitterError) newErrors.twitter = twitterError;
            }
            if (formData.discord) {
                const discordError = validateUrl(formData.discord, "Discord URL");
                if (discordError) newErrors.discord = discordError;
            }
            if (formData.github) {
                const githubError = validateUrl(formData.github, "GitHub URL");
                if (githubError) newErrors.github = githubError;
            }

            if (!formData.logo) newErrors.logo = 'Please upload a logo.';
            if (!formData.banner) newErrors.banner = 'Please upload a banner image.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || isSuccess) return;

        if (!validateStep(1) || !validateStep(2)) {
            if (!validateStep(1)) setCurrentStep(1);
            else if (!validateStep(2)) setCurrentStep(2);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            let logoData = formData.logo;
            let bannerData = formData.banner;

            if (fileData.logo) logoData = await fileToBase64(fileData.logo);
            if (fileData.banner) bannerData = await fileToBase64(fileData.banner);

            await onSubmit({
                ...formData,
                logo: logoData,
                banner: bannerData,
            });

            setIsSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2500);

        } catch (error) {
            console.error("Submission failed", error);
            setErrors({ form: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const previewProject: Project = {
        id: 999,
        name: formData.name || 'Project Name',
        tagline: formData.tagline || 'Your catchy tagline.',
        description: formData.description || "Your project's description will be shown here.",
        category: formData.category,
        tags: ['New', 'Community'],
        logo: formData.logo || `https://placehold.co/100x100/6b7280/ffffff?text=Logo`,
        banner: formData.banner || `https://placehold.co/400x225/6b7280/ffffff?text=Banner`,
        url: formData.url,
        products: [],
        verified: false,
        lastActivity: new Date().toISOString(),
        popularityScore: 50,
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Project Details
                            </h3>
                            <CustomFormInput
                                label="Project Name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                error={errors.name}
                                placeholder="e.g., Aura Finance"
                            />
                            <CustomFormInput
                                label="Tagline"
                                id="tagline"
                                value={formData.tagline}
                                onChange={handleInputChange}
                                required
                                maxLength={100}
                                error={errors.tagline}
                                placeholder="A short, catchy phrase for your project"
                            />
                            <CustomFormTextarea
                                label="Description"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                maxLength={500}
                                error={errors.description}
                                placeholder="Tell us more about what your project does"
                            />
                            <CustomFormSelect
                                label="Category"
                                id="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                error={errors.category}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </CustomFormSelect>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Links & Socials
                            </h3>
                            <CustomFormInput
                                label="Project Website"
                                id="url"
                                type="url"
                                placeholder="https://example.com"
                                value={formData.url}
                                onChange={handleInputChange}
                                required
                                error={errors.url}
                                icon={<GlobeIcon className="w-4 h-4" />}
                            />
                            <CustomFormInput
                                label="X (Twitter) URL"
                                id="twitter"
                                type="url"
                                placeholder="https://x.com/SuiNetwork"
                                value={formData.twitter}
                                onChange={handleInputChange}
                                error={errors.twitter}
                                icon={<XIcon className="w-4 h-4" />}
                            />
                            <CustomFormInput
                                label="Discord Invite URL"
                                id="discord"
                                type="url"
                                placeholder="https://discord.gg/sui"
                                value={formData.discord}
                                onChange={handleInputChange}
                                error={errors.discord}
                                icon={<DiscordIcon className="w-4 h-4" />}
                            />
                            <CustomFormInput
                                label="GitHub Repository URL"
                                id="github"
                                type="url"
                                placeholder="https://github.com/MystenLabs/sui"
                                value={formData.github}
                                onChange={handleInputChange}
                                error={errors.github}
                                icon={<GitHubIcon className="w-4 h-4" />}
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Visual Assets
                            </h3>
                            <ImageUpload
                                label="Logo"
                                id="logo"
                                imageUrl={formData.logo}
                                onRemove={() => handleRemoveImage('logo')}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                recommendedSize="512x512px, 1:1 ratio"
                                aspectRatioClass="aspect-square"
                                error={errors.logo}
                            />
                            <ImageUpload
                                label="Banner"
                                id="banner"
                                imageUrl={formData.banner}
                                onRemove={() => handleRemoveImage('banner')}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                recommendedSize="1600x900px, 16:9 ratio"
                                aspectRatioClass="aspect-video"
                                error={errors.banner}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Information</h3>
                            <ReviewItem label="Project Name" value={formData.name} />
                            <ReviewItem label="Tagline" value={formData.tagline} />
                            <ReviewItem label="Description" value={formData.description} />
                            <ReviewItem
                                label="Category"
                                value={
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {formData.category}
                                    </span>
                                }
                            />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links & Socials</h3>
                            <ReviewItem label="Website" value={formData.url} />
                            {formData.twitter && <ReviewItem label="X (Twitter)" value={formData.twitter} />}
                            {formData.discord && <ReviewItem label="Discord" value={formData.discord} />}
                            {formData.github && <ReviewItem label="GitHub" value={formData.github} />}
                        </div>
                        {errors.form && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-sm text-red-600 dark:text-red-400 text-center">{errors.form}</p>
                            </div>
                        )}
                    </div>
                );
        }
    };

    const nextButtonText = currentStep === 2 ? 'Review' : 'Next Step';

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            <form
                onSubmit={handleFormSubmit}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`relative bg-white dark:bg-gray-900 w-full max-w-6xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col transition-transform duration-300 ${
                    isClosing ? 'scale-95' : 'scale-100'
                }`}
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col min-h-0 h-full"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                                            Submit Your Project
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                            Get your dApp featured on the Sui Ecosystem Explorer.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        aria-label="Close submission form"
                                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="max-w-6xl mx-auto">
                                    <StepIndicator currentStep={currentStep} />
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Form Content */}
                                        <div className="lg:col-span-2">
                                            <AnimatePresence mode="wait">
                                                <m.div
                                                    key={currentStep}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                >
                                                    {renderStepContent()}
                                                </m.div>
                                            </AnimatePresence>
                                        </div>

                                        {/* Preview Section - Show on all steps except review */}
                                        {currentStep < 3 && (
                                            <div className="lg:col-span-1">
                                                <PreviewSection project={previewProject} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
                                <div>
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            disabled={isSubmitting || isSuccess}
                                            className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                                        >
                                            Back
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isSubmitting || isSuccess}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {nextButtonText}
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isSuccess}
                                            className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Project'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
};

export default SubmitProjectModal;