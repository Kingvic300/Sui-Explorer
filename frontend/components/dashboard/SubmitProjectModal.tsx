import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../../data/projects';
import ProjectCard from './ProjectCard';
import { CheckCircleIcon, XLogo, DiscordIcon, GlobeAltIcon, GitHubIcon } from '../Icons';

type ProjectCategory = 'DeFi' | 'Gaming' | 'NFT' | 'Infrastructure';
const categories: ProjectCategory[] = ['DeFi', 'Gaming', 'NFT', 'Infrastructure'];

interface SubmitProjectModalProps {
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'stats' | 'reviews'>) => Promise<void>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <fieldset className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800/70">
        <legend className="flex items-center gap-3 font-display text-xl font-semibold text-white mb-6">
            {icon}
            {title}
        </legend>
        <div className="space-y-5">
            {children}
        </div>
    </fieldset>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string, icon?: React.ReactNode }> = ({ label, id, error, icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-400 mb-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">{icon}</div>}
            <input 
                id={id} 
                {...props} 
                className={`w-full bg-gray-900/70 border ${error ? 'border-red-500/60' : 'border-gray-700/60'} rounded-lg ${icon ? 'pl-10' : 'px-3'} py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/50 focus:border-red-500' : 'focus:ring-blue-500/50 focus:border-blue-500'} transition-all duration-300 focus:shadow-[0_0_20px_theme(colors.blue.800)]`} 
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
        </div>
        {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-400 mb-1">{label}</label>
        <textarea 
            id={id} 
            {...props} 
            className={`w-full bg-gray-900/70 border ${error ? 'border-red-500/60' : 'border-gray-700/60'} rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/50 focus:border-red-500' : 'focus:ring-blue-500/50 focus:border-blue-500'} transition-all duration-300 focus:shadow-[0_0_20px_theme(colors.blue.800)]`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
);

const ImageUpload: React.FC<{
    label: string;
    id: 'logo' | 'banner';
    imageUrl: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    recommendedSize: string;
    aspectRatioClass: string;
    error?: string;
}> = ({ label, id, imageUrl, onChange, accept, recommendedSize, aspectRatioClass, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-400 mb-1">{label}</label>
        <div className={`relative group w-full ${aspectRatioClass} border-2 border-dashed ${error ? 'border-red-500/60' : 'border-gray-700/80'} rounded-xl flex items-center justify-center text-center overflow-hidden transition-colors hover:border-blue-600/70`}>
            {imageUrl ? (
                <>
                    <img src={imageUrl} alt={`${id} preview`} className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                </>
            ) : (
                <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-xs">{recommendedSize}</p>
                </div>
            )}
            <label htmlFor={id} className="absolute inset-0 cursor-pointer z-20 flex items-center justify-center">
                <div className={`py-2 px-4 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm transition-all duration-300 ${imageUrl ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                    {imageUrl ? 'Change' : 'Upload'}
                </div>
            </label>
            <input id={id} type="file" onChange={onChange} accept={accept} className="sr-only" />
        </div>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
);

const steps = ['Project Details', 'Links & Visuals', 'Review & Submit'];
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex items-center justify-between">
        {steps.map((title, index) => {
            const step = index + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            return (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center text-center w-1/3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 ${isCompleted ? 'bg-green-500 border-green-400 text-white' : isActive ? 'bg-blue-500 border-blue-400 text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-gray-700 border-gray-600 text-gray-400'}`}>
                            {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : step}
                        </div>
                        <p className={`mt-2 text-xs font-semibold transition-colors truncate ${isActive ? 'text-white' : 'text-gray-500'}`}>{title}</p>
                    </div>
                    {step < steps.length && <div className={`flex-1 h-1 -mt-8 mx-2 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}></div>}
                </React.Fragment>
            );
        })}
    </div>
);

const ReviewItem: React.FC<{ label: string; value?: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-semibold text-gray-400">{label}</h4>
        <div className="text-white break-words">{value || <span className="text-gray-600 italic">Not provided</span>}</div>
    </div>
);

const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({ onClose, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        category: 'DeFi' as ProjectCategory,
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
    logoUrlRef.current = formData.logo;
    const bannerUrlRef = useRef(formData.banner);
    bannerUrlRef.current = formData.banner;

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
          if (bannerUrlRef.current && bannerUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(bannerUrlRef.current);
          }
        };
    }, [handleClose]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id as keyof typeof errors];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target as { id: 'logo' | 'banner', files: FileList | null };
        if (files && files[0]) {
            const file = files[0];

            if (formData[id] && formData[id].startsWith('blob:')) {
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
            if (!formData.description.trim()) newErrors.description = 'Description is required.';
            if (!formData.category) newErrors.category = 'Please select a category.';
        } else if (step === 2) {
            const urlError = validateUrl(formData.url, "Project Website");
            if (urlError) newErrors.url = urlError;
            else if (!formData.url.trim()) newErrors.url = "Project Website is required.";
    
            const twitterError = validateUrl(formData.twitter, "X (Twitter) URL");
            if (twitterError) newErrors.twitter = twitterError;
            
            const discordError = validateUrl(formData.discord, "Discord URL");
            if (discordError) newErrors.discord = discordError;
    
            const githubError = validateUrl(formData.github, "GitHub URL");
            if (githubError) newErrors.github = githubError;

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

        // Final validation of all steps
        if (!validateStep(1) || !validateStep(2)) {
            // If validation fails for any previous step, go back to the first one with errors
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
                twitter: formData.twitter || undefined,
                discord: formData.discord || undefined,
                github: formData.github || undefined,
            });

            setIsSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (error) {
            console.error("Submission failed", error);
            setErrors({ form: 'An error occurred. Please see notification for details.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const previewProject: Project = {
        id: 999,
        name: formData.name || 'Project Name',
        tagline: formData.tagline || 'Your catchy tagline goes here.',
        description: formData.description,
        category: formData.category,
        logo: formData.logo || `https://picsum.photos/seed/placeholderlogo/100/100`,
        banner: formData.banner || `https://picsum.photos/seed/placeholderbanner/800/600`,
        url: formData.url,
        twitter: formData.twitter,
        discord: formData.discord,
        github: formData.github,
        stats: { tvl: "TBD", users: "New", volume: "N/A" },
        reviews: [],
    };
    
    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <FormSection title="Project Details" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
                        <FormInput label="Project Name *" id="name" value={formData.name} onChange={handleInputChange} required aria-required="true" error={errors.name} placeholder="e.g., Aura Finance" />
                        <FormInput label="Tagline *" id="tagline" value={formData.tagline} onChange={handleInputChange} required aria-required="true" error={errors.tagline} placeholder="A short, catchy phrase for your project" />
                        <FormTextarea label="Description *" id="description" value={formData.description} onChange={handleInputChange} required aria-required="true" rows={3} error={errors.description} placeholder="Tell us more about what your project does" />
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-400 mb-1">Category *</label>
                            <select id="category" value={formData.category} onChange={handleInputChange} className={`w-full bg-gray-900/70 border ${errors.category ? 'border-red-500/60' : 'border-gray-700/60'} rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 ${errors.category ? 'focus:ring-red-500/50' : 'focus:ring-blue-500/50'} transition-all duration-300 focus:shadow-[0_0_20px_theme(colors.blue.800)]`}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </FormSection>
                );
            case 2:
                return (
                    <>
                        <FormSection title="Links & Socials" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}>
                            <FormInput label="Project Website *" id="url" type="url" placeholder="https://example.com" value={formData.url} onChange={handleInputChange} required aria-required="true" error={errors.url} icon={<GlobeAltIcon className="w-5 h-5" />} />
                            <FormInput label="X (Twitter) URL" id="twitter" type="url" placeholder="https://x.com/SuiNetwork" value={formData.twitter} onChange={handleInputChange} error={errors.twitter} icon={<XLogo className="w-5 h-5" />} />
                            <FormInput label="Discord Invite URL" id="discord" type="url" placeholder="https://discord.gg/sui" value={formData.discord} onChange={handleInputChange} error={errors.discord} icon={<DiscordIcon className="w-5 h-5" />} />
                            <FormInput label="GitHub Repository URL" id="github" type="url" placeholder="https://github.com/MystenLabs/sui" value={formData.github} onChange={handleInputChange} error={errors.github} icon={<GitHubIcon className="w-5 h-5" />} />
                        </FormSection>
                        <FormSection title="Visual Assets" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                            <ImageUpload label="Logo *" id="logo" imageUrl={formData.logo} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, image/webp" recommendedSize="512x512px, 1:1 ratio" aspectRatioClass="aspect-square" error={errors.logo} />
                            <ImageUpload label="Banner *" id="banner" imageUrl={formData.banner} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, image/webp" recommendedSize="1600x900px, 16:9 ratio" aspectRatioClass="aspect-video" error={errors.banner} />
                        </FormSection>
                    </>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800/70 space-y-4">
                            <ReviewItem label="Project Name" value={formData.name} />
                            <ReviewItem label="Tagline" value={formData.tagline} />
                            <ReviewItem label="Description" value={formData.description} />
                            <ReviewItem label="Category" value={<span className="mt-1 text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{formData.category}</span>} />
                        </div>
                        <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800/70 space-y-4">
                            <ReviewItem label="Website" value={formData.url} />
                            {formData.twitter && <ReviewItem label="X (Twitter)" value={formData.twitter} />}
                            {formData.discord && <ReviewItem label="Discord" value={formData.discord} />}
                            {formData.github && <ReviewItem label="GitHub" value={formData.github} />}
                        </div>
                        {errors.form && <p id="form-error" className="text-sm text-red-400 text-center bg-red-900/30 p-3 rounded-lg">{errors.form}</p>}
                    </div>
                );
        }
    };
    
    const nextButtonText = currentStep === 2 ? 'Review' : 'Next Step';

    const submitButtonClasses = () => {
        if (isSuccess) return 'bg-gradient-to-r from-green-500 to-teal-500';
        if (isSubmitting) return 'bg-indigo-700 cursor-wait';
        return 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-400';
    };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
      <form onSubmit={handleFormSubmit} ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`relative bg-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 flex flex-col transition-transform duration-300 modal-glow-border ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-800 flex-shrink-0">
          <h2 id="modal-title" className="font-display text-2xl sm:text-3xl font-bold text-white">Submit Your Project</h2>
          <p className="text-gray-400 mt-1">Get your dApp featured on the Sui Ecosystem Explorer.</p>
          <button type="button" onClick={handleClose} aria-label="Close submission form" className="absolute top-6 right-6 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors disabled:opacity-50" disabled={isSubmitting}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-2 gap-12 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col space-y-8">
                    <StepIndicator currentStep={currentStep} />
                    {renderStepContent()}
                </div>

                <div className="hidden lg:block">
                    <div className="sticky top-8">
                        <h3 className="font-display text-xl font-semibold text-white mb-4">Live Preview</h3>
                        <div className="relative group">
                            <ProjectCard project={previewProject} index={0} onSelect={() => {}} isFavorite={false} onToggleFavorite={() => {}} user={null} onAuthRequired={() => {}} />
                             <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] rounded-2xl flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white font-semibold bg-black/50 py-2 px-4 rounded-lg border border-gray-600">PREVIEW MODE</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4 text-center">This is how your project card will appear in the explorer.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-6 md:p-8 border-t border-gray-800 flex justify-between items-center bg-gray-900">
            <div>
                {currentStep > 1 && (
                     <button type="button" onClick={handleBack} disabled={isSubmitting || isSuccess} className="bg-transparent border border-gray-700 text-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50">
                        Back
                    </button>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button type="button" onClick={handleClose} disabled={isSubmitting || isSuccess} className="bg-transparent text-gray-400 font-semibold py-2 px-5 rounded-lg hover:text-white transition-all duration-300 disabled:opacity-50">
                    Cancel
                </button>
                {currentStep < 3 ? (
                    <button type="button" onClick={handleNext} className="bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105">
                        {nextButtonText}
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        disabled={isSubmitting || isSuccess} 
                        className={`relative font-semibold py-3 px-5 rounded-lg transition-all duration-300 transform text-white overflow-hidden focus:outline-none flex items-center justify-center w-48 h-12 ${submitButtonClasses()}`}
                    >
                        {isSubmitting && <span className="absolute top-0 -left-full w-full h-full bg-white/10 blur-sm -skew-x-12 animate-shimmer" />}
                        <span className="relative z-10 flex items-center justify-center w-full h-full">
                            {isSuccess ? (
                                <span className="flex items-center gap-2 animate-fade-in"><CheckCircleIcon className="w-6 h-6" />Submitted!</span>
                            ) : isSubmitting ? (
                                <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>
                            ) : ( 'Submit Project' )}
                        </span>
                    </button>
                )}
            </div>
        </div>
        <style>{`
            @keyframes shimmer {
                to { transform: translateX(100%) skewX(-12deg); }
            }
            .animate-shimmer {
                animation: shimmer 1.5s ease-in-out infinite;
                transform: translateX(-100%) skewX(-12deg);
            }
            @keyframes fade-in {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
      </form>
    </div>
  );
};

export default SubmitProjectModal;