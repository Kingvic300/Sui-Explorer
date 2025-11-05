export interface Review {
    id: number;
    author: string;
    avatar: string;
    rating: number;
    comment: string;
}
  
export interface Project {
    id: number;
    name: string;
    tagline: string;
    description: string;
    category: 'DeFi' | 'Gaming' | 'NFT' | 'Infrastructure';
    logo: string;
    banner: string;
    url: string;
    twitter?: string;
    discord?: string;
    github?: string;
    stats: {
        tvl: string;
        users: string;
        volume: string;
    };
    reviews: Review[];
}
  
export const projectsData: Project[] = [
    {
      id: 1,
      name: "Aura Finance",
      tagline: "Yield optimization and liquid staking.",
      description: "Aura Finance is a protocol built on top of the Balancer system to provide maximum incentives to Balancer liquidity providers and BAL stakers (into veBAL) through social aggregation of BAL deposits and Aura's native token.",
      category: 'DeFi',
      logo: "https://picsum.photos/seed/logo1/100/100",
      banner: "https://picsum.photos/seed/banner1/800/600",
      url: "https://aura.finance/",
      twitter: "https://twitter.com/AuraFinance",
      discord: "https://discord.gg/aurafinance",
      github: "https://github.com/aurafinance",
      stats: { tvl: "$450M", users: "15k", volume: "$1.2B" },
      reviews: [
        { id: 1, author: "CryptoKing", avatar: "https://picsum.photos/seed/rev1/100/100", rating: 5, comment: "Amazing yields and super easy to use!" },
        { id: 2, author: "DeFi Degen", avatar: "https://picsum.photos/seed/rev2/100/100", rating: 4, comment: "Solid platform, would like to see more pools." },
      ]
    },
    {
      id: 2,
      name: "Cyberscape",
      tagline: "A decentralized metaverse for gaming.",
      description: "Cyberscape is an ever-expanding, decentralized gaming world built by its users. Players can create, experience, and monetize content and applications.",
      category: 'Gaming',
      logo: "https://picsum.photos/seed/logo2/100/100",
      banner: "https://picsum.photos/seed/banner2/800/600",
      url: "https://cyberscape.game/",
      twitter: "https://twitter.com/CyberscapeGame",
      discord: "https://discord.gg/cyberscape",
      stats: { tvl: "$50M", users: "120k", volume: "$80M" },
      reviews: [
        { id: 1, author: "GameMaster", avatar: "https://picsum.photos/seed/rev3/100/100", rating: 5, comment: "The future of gaming is here. Mind-blowing experience!" },
      ]
    },
    {
      id: 3,
      name: "NFT Nexus",
      tagline: "The premier marketplace for Sui NFTs.",
      description: "NFT Nexus is the leading destination for NFTs on the Sui blockchain. Discover, collect, and sell extraordinary NFTs from a diverse community of artists and creators.",
      category: 'NFT',
      logo: "https://picsum.photos/seed/logo3/100/100",
      banner: "https://picsum.photos/seed/banner3/800/600",
      url: "https://nftnexus.market/",
      twitter: "https://twitter.com/NFTNexus",
      stats: { tvl: "N/A", users: "50k", volume: "$200M" },
      reviews: [
         { id: 1, author: "ArtCollector", avatar: "https://picsum.photos/seed/rev4/100/100", rating: 5, comment: "Beautiful UI and great selection of artists." },
         { id: 2, author: "JPG Enthusiast", avatar: "https://picsum.photos/seed/rev5/100/100", rating: 4, comment: "Low fees, but needs more curation." },
      ]
    },
     {
      id: 4,
      name: "SuiSwap",
      tagline: "Fast and secure token swaps.",
      description: "SuiSwap is a decentralized exchange (DEX) that allows for fast, secure, and low-cost token swaps. It leverages the unique architecture of the Sui blockchain to provide an unparalleled trading experience.",
      category: 'DeFi',
      logo: "https://picsum.photos/seed/logo4/100/100",
      banner: "https://picsum.photos/seed/banner4/800/600",
      url: "https://suiswap.fi/",
      github: "https://github.com/suiswap",
      stats: { tvl: "$200M", users: "80k", volume: "$5B" },
      reviews: []
    },
    {
        id: 5,
        name: "Sui Name Service",
        tagline: "Your identity for the decentralized web.",
        description: "Secure your unique .sui domain. Sui Name Service maps human-readable names like 'yourname.sui' to machine-readable identifiers such as Sui addresses, content hashes, and metadata.",
        category: 'Infrastructure',
        logo: "https://picsum.photos/seed/logo5/100/100",
        banner: "https://picsum.photos/seed/banner5/800/600",
        url: "https://suins.io/",
        twitter: "https://twitter.com/SuiNSdapp",
        stats: { tvl: "$5M", users: "250k", volume: "$10M" },
        reviews: [
            { id: 1, author: "Web3Pioneer", avatar: "https://picsum.photos/seed/rev6/100/100", rating: 5, comment: "Essential for anyone building on Sui. Got my name instantly." },
        ]
    },
    {
        id: 6,
        name: "PixelVerse",
        tagline: "Craft, battle, and earn in a pixelated world.",
        description: "PixelVerse is a play-to-earn game that combines elements of crafting, battling, and strategy. Build your empire, train your heroes, and compete for glory and rewards.",
        category: 'Gaming',
        logo: "https://picsum.photos/seed/logo6/100/100",
        banner: "https://picsum.photos/seed/banner6/800/600",
        url: "https://pixelverse.gg/",
        discord: "https://discord.gg/pixelverse",
        stats: { tvl: "$15M", users: "75k", volume: "$40M" },
        reviews: [
             { id: 1, author: "RetroGamer", avatar: "https://picsum.photos/seed/rev7/100/100", rating: 4, comment: "Fun and addictive. The economy is well-balanced." },
        ]
    }
];