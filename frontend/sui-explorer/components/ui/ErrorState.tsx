
import React from 'react';
import Card from './Card';
import Button from './Button';
import { AlertTriangleIcon } from '../icons/MiscIcons';

interface ErrorStateProps {
    title: string;
    message: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => {
    return (
        <div className="text-center py-10 px-4 w-full">
            <Card className="max-w-md mx-auto !p-6">
                <AlertTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-slate-800 dark:text-slate-300 mb-6">{message}</p>
                {onRetry && (
                    <Button onClick={onRetry} variant="primary">
                        Try Again
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default ErrorState;