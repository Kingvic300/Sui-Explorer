

import React from 'react';
import { XIcon, DiscordIcon, GlobeIcon, GitHubIcon, AlertTriangleIcon } from '../../icons/MiscIcons';

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <fieldset className="bg-dark-card/50 p-6 rounded-2xl border border-dark-border">
        <legend className="flex items-center gap-3 font-display text-xl font-semibold text-white mb-6">
            {icon}
            {title}
        </legend>
        <div className="space-y-5">
            {children}
        </div>
    </fieldset>
);

export const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string, icon?: React.ReactNode }> = ({ label, id, error, icon, ...props }) => (
    <div>
        {label && <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-1.5">{label}</label>}
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">{icon}</div>}
            <input 
                id={id} 
                {...props} 
                className={`w-full bg-dark-bg/70 border ${error ? 'border-red-500/60' : 'border-dark-border/60'} rounded-lg ${icon ? 'pl-10' : 'px-3.5'} py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/50 focus:border-red-500' : 'focus:ring-accent-blue/50 focus:border-accent-blue'} transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.2)]`} 
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
        </div>
        {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400 flex items-center gap-1 animate-fade-in-down"><AlertTriangleIcon className="w-3.5 h-3.5" />{error}</p>}
    </div>
);

export const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }> = ({ label, id, error, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-1.5">{label}</label>
        <textarea 
            id={id} 
            {...props} 
            className={`w-full bg-dark-bg/70 border ${error ? 'border-red-500/60' : 'border-dark-border/60'} rounded-lg px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/50 focus:border-red-500' : 'focus:ring-accent-blue/50 focus:border-accent-blue'} transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.2)]`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400 flex items-center gap-1 animate-fade-in-down"><AlertTriangleIcon className="w-3.5 h-3.5" />{error}</p>}
    </div>
);

export const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; children: React.ReactNode }> = ({ label, id, error, children, ...props }) => (
    <div className="w-full">
        {label && <label htmlFor={id} className="block text-sm font-semibold text-slate-300 mb-1.5">{label}</label>}
        <div className="relative">
            <select
                id={id}
                {...props}
                className={`w-full appearance-none bg-light-card dark:bg-dark-bg/70 border ${error ? 'border-red-500/60' : 'border-light-border dark:border-dark-border/60'} rounded-lg px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/50 focus:border-red-500' : 'focus:ring-accent-blue/50 focus:border-accent-blue'} transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.2)] ${props.className || ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
        {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400 flex items-center gap-1 animate-fade-in-down"><AlertTriangleIcon className="w-3.5 h-3.5" />{error}</p>}
    </div>
);

export const ImageUpload: React.FC<{
    label: string;
    id: string;
    imageUrl?: string;
    onRemove: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    recommendedSize: string;
    aspectRatioClass: string;
    error?: string;
}> = ({ label, id, imageUrl, onChange, onRemove, accept, recommendedSize, aspectRatioClass, error }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">{label}</label>
        <div className={`relative group w-full ${aspectRatioClass} border-2 border-dashed ${error ? 'border-red-500/60' : 'border-dark-border/80'} rounded-xl flex items-center justify-center text-center overflow-hidden transition-colors hover:border-accent-blue/70 bg-dark-bg/30`}>
            {imageUrl ? (
                <>
                    <img src={imageUrl} alt={`${id} preview`} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-4">
                        <label htmlFor={id} className="cursor-pointer py-2 px-4 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all">
                            Change
                        </label>
                        <button type="button" onClick={onRemove} className="py-2 px-4 rounded-lg bg-red-600/80 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-red-500 transition-all">
                            Remove
                        </button>
                    </div>
                </>
            ) : (
                <label htmlFor={id} className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 text-slate-500 group-hover:text-slate-300 transition-colors">
                    <svg className="mx-auto h-10 w-10" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mt-2 text-sm font-semibold">Upload Image</span>
                    <p className="mt-1 text-xs">{recommendedSize}</p>
                </label>
            )}
            <input id={id} name={id} type="file" onChange={onChange} accept={accept} className="sr-only" />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1 animate-fade-in-down"><AlertTriangleIcon className="w-3.5 h-3.5" />{error}</p>}
    </div>
);