/**
 * A reusable utility for simulating API calls.
 * It handles loading states, potential failures, and global notifications.
 *
 * @param mockData The data to return on a successful call. Can be a value or a function to be executed.
 * @param showNotification A function to display success or error messages.
 * @param options Configuration for the mock call (delay, fail chance, etc.).
 * @returns A promise that resolves with the mock data on success, or null/throws on failure.
 */
export const apiCall = async <T>(
    mockData: T | (() => T),
    showNotification: (message: string, type: 'success' | 'error') => void,
    options: {
        delay?: number;
        failChance?: number;
        errorMessage?: string;
        errorStatus?: number;
        errorPrefix?: string;
        rethrow?: boolean;
    } = {}
): Promise<T | null> => {
    const {
        delay = 500,
        failChance = 0.2,
        errorMessage = 'An API error occurred.',
        errorStatus = 500,
        errorPrefix,
        rethrow = false,
    } = options;

    try {
        await new Promise(resolve => setTimeout(resolve, delay));

        if (Math.random() < failChance) {
            const error: any = new Error(errorMessage);
            error.status = errorStatus;
            throw error;
        }

        return typeof mockData === 'function' ? (mockData as () => T)() : mockData;
    } catch (error: any) {
        const baseMessage = `${error.message} (Status: ${error.status || 'N/A'})`;
        const message = errorPrefix ? `${errorPrefix}: ${baseMessage}` : baseMessage;
        showNotification(message, 'error');
        
        if (rethrow) {
            throw error;
        }
        
        return null;
    }
};
