export interface Tweet {
    id: number;
    name: string;
    handle: string;
    avatar: string;
    text: string;
    link: string;
}

export const tweetsData: Tweet[] = [
    {
      id: 1,
      name: "Sui Network",
      handle: "@SuiNetwork",
      avatar: "https://picsum.photos/seed/sui_avatar/100/100",
      text: "The Sui Overflow global hackathon is officially underway! We're blown away by the talent and innovation. Who will build the next big thing on Sui? #SuiOverflow",
      link: "https://x.com/SuiNetwork"
    },
    {
      id: 2,
      name: "Aura Finance",
      handle: "@AuraFinance",
      avatar: "https://picsum.photos/seed/logo1/100/100",
      text: "We just crossed $500M in TVL! A huge thank you to our amazing community for the trust and support. More exciting yield strategies coming soon! 🚀 #DeFi #Sui",
      link: "https://x.com/AuraFinance"
    },
    {
      id: 3,
      name: "Cyberscape",
      handle: "@CyberscapeGame",
      avatar: "https://picsum.photos/seed/logo2/100/100",
      text: "Our first major tournament is live! 1,000,000 $SUI prize pool. Do you have what it takes to be the champion of Cyberscape? #SuiGaming #P2E",
      link: "https://x.com/CyberscapeGame"
    },
    {
      id: 4,
      name: "NFT Nexus",
      handle: "@NFTNexus",
      avatar: "https://picsum.photos/seed/logo3/100/100",
      text: "The 'Sui Drips' collection by @PixelArtisan just sold out in under 5 minutes! The energy in the #SuiNFT space is unreal right now. What's the next big drop?",
      link: "https://x.com/NFTNexus"
    },
    {
        id: 5,
        name: "Sui Name Service",
        handle: "@SuiNS",
        avatar: "https://picsum.photos/seed/logo5/100/100",
        text: "You can now link your .sui name to your X profile. Web3 identity is becoming more integrated every day. Show off your Sui pride!",
        link: "https://x.com/SuiNSdapp"
    },
    {
        id: 6,
        name: "Sui Daily",
        handle: "@SuiDaily",
        avatar: "https://picsum.photos/seed/suidaily/100/100",
        text: "BREAKING: Move language just got a massive performance upgrade in the latest Sui devnet. This could be a game-changer for complex on-chain operations. #MoveLang #SuiDev",
        link: "https://x.com/SuiDaily"
    }
];
