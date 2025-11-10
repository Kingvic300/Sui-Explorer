import { projectsData } from '../data/projects';
import { newsData } from '../data/news';
import { Project, NewsArticle } from '../types/index';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchProjects = async (): Promise<Project[]> => {
    await delay(500);
    // Simulate a potential API error
    if (Math.random() > 0.8) {
        throw new Error("Failed to fetch projects. Please try again later.");
    }
    return projectsData;
};

export const fetchProjectById = async (id: number): Promise<Project> => {
    await delay(300);
    if (Math.random() > 0.8) {
        throw new Error(`Failed to fetch project details. The network may be busy.`);
    }
    const project = projectsData.find(p => p.id === id);
    if (!project) {
        throw new Error(`Project with ID ${id} not found.`);
    }
    return project;
};

export const fetchNews = async (): Promise<NewsArticle[]> => {
    await delay(700);
    if (Math.random() > 0.9) {
        throw new Error("Failed to fetch news articles.");
    }
    return newsData;
};