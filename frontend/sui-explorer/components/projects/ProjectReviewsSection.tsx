import React, { useMemo, useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import Card from '@/components/ui/Card.tsx';
import Button from "@/components/ui/Button.tsx";
import { StarRating } from "@/components/shared/StarRating.tsx";
import { MessageSquareIcon } from "lucide-react";
import ReviewCard from "../projects/ReviewCard.tsx";
import { ReviewForm } from "./ReviewForm";
import { useToastStore } from "@/stores/useToastStore";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Review } from "@/types/index.ts";

type SortByType = "recent" | "helpful";

const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const ProjectReviewsSection: React.FC<{
    reviews?: Review[];
    projectName: string;
}> = ({ reviews: initialReviews = [], projectName }) => {
    const currentAccount = useCurrentAccount();
    const isConnected = !!currentAccount;
    const [reviews, setReviews] = useState(initialReviews);
    const [sortBy, setSortBy] = useState<SortByType>("recent");
    const [isWriting, setIsWriting] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const addToast = useToastStore((s) => s.addToast);

    useEffect(() => setReviews(initialReviews), [initialReviews]);

    const handleWriteReviewClick = () => {
        if (!isConnected) {
            addToast({
                type: "info",
                title: "Connect Wallet",
                message: "Please connect your wallet to leave a review.",
            });
            return;
        }
        setIsWriting(true);
    };

    const handleAddReview = (newReview: Review) => {
        setReviews((prev) => [newReview, ...prev]);
        setIsWriting(false);
    };

    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            if (sortBy === "recent")
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            if (sortBy === "helpful") return b.helpful.yes - a.helpful.yes;
            return 0;
        });
    }, [reviews, sortBy]);

    const displayed = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);

    const summary = useMemo(() => {
        const total = reviews.length;
        if (!total) return { average: 0, total: 0, distribution: [] };
        const average = reviews.reduce((a, r) => a + r.rating, 0) / total;
        const distribution = [5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            return { star, count, percentage: (count / total) * 100 };
        });
        return { average, total, distribution };
    }, [reviews]);

    return (
        <Card>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Summary */}
                <div className="lg:col-span-1 lg:border-r lg:pr-8 border-light-border dark:border-dark-border">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                        Community Reviews
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-4xl font-bold text-slate-800 dark:text-white">
                            {summary.average.toFixed(1)}
                        </p>
                        <div>
                            <StarRating rating={summary.average} />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                based on {summary.total} reviews
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        {summary.distribution.map(({ star, count, percentage }) => (
                            <div key={star} className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {star} star
                </span>
                                <div className="w-full bg-slate-200 dark:bg-dark-border rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
                  {count}
                </span>
                            </div>
                        ))}
                    </div>

                    {isConnected && (
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                onClick={handleWriteReviewClick}
                                className="w-full"
                                disabled={isWriting}
                            >
                                {isWriting ? "Writing Review..." : "Write a Review"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Reviews & Form */}
                <div className="lg:col-span-2">
                    <AnimatePresence>
                        {isWriting && (
                            <ReviewForm
                                projectName={projectName}
                                onCancel={() => setIsWriting(false)}
                                onAddReview={handleAddReview}
                                currentUserAddress={currentAccount?.address}
                            />
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4 mt-6">
                        <div className="flex items-center gap-2 text-sm mb-4 sm:mb-0">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Sort by:
              </span>
                            <button
                                onClick={() => setSortBy("helpful")}
                                className={`font-bold ${
                                    sortBy === "helpful"
                                        ? "text-accent-blue"
                                        : "text-slate-600 dark:text-slate-300"
                                }`}
                            >
                                Most Helpful
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <button
                                onClick={() => setSortBy("recent")}
                                className={`font-bold ${
                                    sortBy === "recent"
                                        ? "text-accent-blue"
                                        : "text-slate-600 dark:text-slate-300"
                                }`}
                            >
                                Most Recent
                            </button>
                        </div>
                    </div>

                    {displayed.length > 0 ? (
                        <m.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                            className="mt-4"
                        >
                            {displayed.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                            {!showAllReviews && reviews.length > 3 && (
                                <div className="text-center mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAllReviews(true)}
                                    >
                                        View All Reviews
                                    </Button>
                                </div>
                            )}
                        </m.div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <MessageSquareIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ProjectReviewsSection;
