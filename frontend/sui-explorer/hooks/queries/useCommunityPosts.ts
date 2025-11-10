

import { useQuery } from '@tanstack/react-query';
import { Post } from '../../types/index';
import { communityPostsData } from '../../data/community';

// TODO: Replace with your actual Sui SDK client and methods
const fetchPostsFromSmartContract = async (): Promise<Post[]> => {
    console.log("Fetching community posts from smart contract...");
    // This is the placeholder for your smart contract call to fetch posts.
    // e.g., const result = await suiClient.queryObjects({ ... });
    // and then parse the result into the Post format.
    await new Promise(res => setTimeout(res, 1000)); // simulate network delay
    return communityPostsData; 
};


export const useCommunityPosts = () => {
    return useQuery({
        queryKey: ['communityPosts'],
        queryFn: fetchPostsFromSmartContract,
        onError: (error) => {
            console.error("Error fetching community posts:", error);
            // Toast is disabled here to prefer inline error message on the community page
        }
    });
};