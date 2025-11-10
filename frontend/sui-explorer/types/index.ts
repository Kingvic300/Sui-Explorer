import { m } from 'framer-motion';
import React from 'react';

// =================================================================
// Global & App-wide Types
// =================================================================

export type Theme = 'light' | 'dark';

// =================================================================
// Data Model Types (Projects, Community, News)
// =================================================================

export interface Review {
  id: number;
  author: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  rating: number; // 1 to 5
  title: string;
  content: string;
  timestamp: string; // ISO 8601 format
  helpful: {
    yes: number;
    no: number;
  };
  reply?: {
    author: string;
    content: string;
    timestamp: string;
  }
}

export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  type: 'SDK' | 'Protocol' | 'dApp' | 'Wallet';
  status: 'Mainnet' | 'Testnet' | 'In Development';
  packages?: { name: string; url: string }[];
  token?: { symbol: string; supply: string };
}

export interface EnrichedProduct extends Product {
    projectId: number;
    projectName: string;
}

export interface TokenInfo {
    symbol: string;
    price: number;
    priceChange24h: number; // percentage
    marketCap: string;
    logo: string;
}

export interface ProjectStats {
    tvl: string;
    users: string;
    transactions: string;
    volume: string;
}

export interface Update {
    id: number;
    title: string;
    date: string;
    image: string;
    link: string;
}
  
export interface Project {
    id: number;
    name: string;
    tagline: string;
    description: string;
    longDescription?: string;
    category: 'DeFi' | 'Gaming' | 'NFT' | 'Infrastructure';
    tags: string[];
    logo: string;
    banner: string;
    url: string;
    twitter?: string;
    discord?: string;
    github?: string;
    products: Product[];
    stats?: ProjectStats;
    verified: boolean;
    lastActivity: string; // ISO 8601 format
    popularityScore: number; // 0-100
    tokenInfo?: TokenInfo;
    updates?: Update[];
    relatedProjectIds?: number[];
    reviews?: Review[];
}
  
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
    tags: string[];
    source: 'Official' | 'Community' | 'Developer';
}

export interface Notification {
    id: number;
    type: 'new_project' | 'review' | 'update';
    title: string;
    description: string;
    timestamp: string; // ISO 8601 format
    read: boolean;
}

export interface Tweet {
    id: number;
    name: string;
    handle: string;
    avatar: string;
    text: string;
    link: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  link: string;
  sourceName: string;
  sourceLogo: string;
  timestamp: string; // ISO 8601 format
  category: 'Ecosystem' | 'Product Launches' | 'Dev Updates' | 'Community';
  featured: boolean;
  image: string;
}

export type TransactionType = 'send' | 'receive' | 'dapp';

export interface MockTransaction {
  id: string;
  type: TransactionType;
  status: 'Success' | 'Pending' | 'Failed';
  description: string;
  timestamp: string;
  amount: number;
  currency: string;
  from: string;
  to: string;
  fee: number;
}


// =================================================================
// Component Prop Types
// =================================================================

export type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
} & React.ComponentProps<typeof m.button>;

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dashed';
}

export interface DropdownMenuProps {
  triggerText: string;
  children: React.ReactNode;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface ErrorStateProps {
    title: string;
    message: string;
    onRetry?: () => void;
}

export type LazyImageProps = {
  placeholderClassName?: string;
  wrapperClassName?: string;
} & React.ComponentProps<typeof m.img>;


export interface ProjectCardProps {
  project: Project;
  index: number;
  rank?: number;
  onSelect: (project: Project) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  user: { address: string } | null;
  onAuthRequired: (action: () => void) => void;
}

export interface SubmissionCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    points: string[];
    buttonText: string;
    onButtonClick: () => void;
}

export interface TransactionDetailModalProps {
  tx: MockTransaction;
  onClose: () => void;
}


// =================================================================
// Form & Modal Types
// =================================================================

export interface ProjectSubmissionData {
    name: string;
    tagline: string;
    description: string;
    category: 'DeFi' | 'Gaming' | 'NFT' | 'Infrastructure',
    url: string;
    twitter?: string;
    discord?: string;
    github?: string;
    logo: string; // base64
    banner: string; // base64
}

export interface SubmitProjectModalProps {
  onClose: () => void;
  onSubmit: (project: ProjectSubmissionData) => Promise<void>;
}

export interface CoinSubmissionData {
    coinAddress: string;
    symbol: string;
    name: string;
    projectId: string;
    logo: string; // base64
}

export interface SubmitCoinModalProps {
  onClose: () => void;
  onSubmit: (coin: CoinSubmissionData) => Promise<void>;
}

export interface AccountSubmissionData {
    address: string;
    name: string;
    description: string;
    url?: string;
    twitter?: string;
    logo: string; // base64
}

export interface SubmitAccountModalProps {
  onClose: () => void;
  onSubmit: (account: AccountSubmissionData) => Promise<void>;
}

export interface ScamReportData {
    type: 'Account' | 'Coin';
    address: string;
    reason: string;
    evidenceUrl?: string;
}

export interface SubmitScamModalProps {
  onClose: () => void;
  onSubmit: (report: ScamReportData) => Promise<void>;
}
