
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchProjectById } from '../../api';
import { useToastStore } from '../../stores/useToastStore';
import { Project } from '../../types';

export const useProjects = () => {
    return useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: fetchProjects,
        onError: (error) => {
            console.error("Error fetching projects:", error);
            useToastStore.getState().addToast({
                id: 'fetch-projects-error',
                type: 'error',
                title: 'Error Fetching Projects',
                message: error instanceof Error ? error.message : 'An unknown error occurred.',
            });
        }
    });
};

export const useProject = (id: number | null) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: () => {
            if (id === null) throw new Error("Invalid project ID");
            return fetchProjectById(id);
        },
        enabled: id !== null, // Only run query if id is not null
        onError: (error) => {
            console.error(`Error fetching project with ID ${id}:`, error);
            // Toast is disabled here to prefer inline error messages on the detail page
        }
    });
};