export interface Post {
    id: number;
    author: string;
    handle: string;
    avatar: string;
    timestamp: string; // ISO 8601 format
    content: string;
    likes: number;
    comments: number;
    shares: number;
    link?: string;
    platform: 'x' | 'web';
    media?: string;
}

export const communityPostsData: Post[] = [
    {
      id: 1,
      author: "Sui Network",
      handle: "@SuiNetwork",
      avatar: "https://picsum.photos/seed/sui_avatar/100/100",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      content: "The latest upgrade to the Sui protocol is now live on testnet! Expect faster finality and lower gas fees. Devs, check out the updated docs to prepare for mainnet. #Sui #L1",
      likes: 1256,
      comments: 89,
      shares: 302,
      link: "https://x.com/SuiNetwork",
      platform: 'x',
    },
    {
      id: 2,
      author: "Sui Name Service",
      handle: "@SuiNS",
      avatar: "https://picsum.photos/seed/logo5/100/100",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      content: "Over 250,000 .sui names have been registered! Your Web3 identity starts here. Get yours before it's gone. 👉 sui.names",
      likes: 832,
      comments: 45,
      shares: 150,
      link: "https://x.com/SuiNS",
      platform: 'x',
    },
    {
        id: 6,
        author: "Sui Foundation",
        handle: "suifoundation.org",
        avatar: "https://picsum.photos/seed/suifoundation/100/100",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        content: "New blog post: 'Understanding Sui's Object-Oriented Data Model'. A deep dive for developers looking to build the next generation of dApps.",
        likes: 450,
        comments: 23,
        shares: 98,
        link: "#",
        platform: 'web',
    },
    {
      id: 3,
      author: "Cyberscape",
      handle: "@CyberscapeGame",
      avatar: "https://picsum.photos/seed/logo2/100/100",
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
      content: "Sneak peek of the new 'Void Runner' character class coming in our next major update. Get ready for some serious speed. #SuiGaming #P2E #Metaverse",
      media: "https://picsum.photos/seed/postmedia1/600/400",
      likes: 2400,
      comments: 213,
      shares: 541,
      link: "https://x.com/CyberscapeGame",
      platform: 'x',
    },
    {
        id: 4,
        author: "NFT Nexus",
        handle: "@NFTNexus",
        avatar: "https://picsum.photos/seed/logo3/100/100",
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
        content: "Just launched: Creator Royalty Standards. We're committed to ensuring artists are fairly compensated on our platform. A big step forward for the #SuiNFT community.",
        likes: 987,
        comments: 68,
        shares: 210,
        link: "https://x.com/NFTNexus",
        platform: 'x',
    },
    {
        id: 5,
        author: "Sui Daily",
        handle: "@SuiDaily",
        avatar: "https://picsum.photos/seed/suidaily/100/100",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        content: "Weekly Ecosystem Roundup 🧵:\n1. @AuraFinance hits $500M TVL\n2. @SuiSwap launches new permissionless pools\n3. @PixelVerse announces land sale\n\nThe #Sui ecosystem is on 🔥!",
        likes: 1800,
        comments: 150,
        shares: 600,
        link: "https://x.com/SuiDaily",
        platform: 'x',
    }
];