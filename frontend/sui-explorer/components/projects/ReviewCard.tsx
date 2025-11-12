import React, { useState } from "react";
import { m } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, ThumbsDown, ShieldCheck } from "lucide-react";
import { StarRating } from "@/components/shared/StarRating";
import LazyImage from "@/components/ui/LazyImage";
import type { Review } from "@/types";

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    const [helpful, setHelpful] = useState(review.helpful);
    const [voted, setVoted] = useState<"yes" | "no" | null>(null);

    const handleVote = (type: "yes" | "no") => {
        if (voted === type) return;
        const updated = { ...helpful };
        if (voted) updated[voted]--;
        updated[type]++;
        setHelpful(updated);
        setVoted(type);
    };

    return (
        <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="py-6 border-b border-light-border dark:border-dark-border/60 last:border-b-0"
        >
            <div className="flex items-start gap-4">
                <LazyImage
                    src={review.author.avatar}
                    alt={review.author.name}
                    wrapperClassName="w-10 h-10 rounded-full bg-light-border dark:bg-dark-border flex-shrink-0 overflow-hidden"
                />

                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {review.author.name}
                            </p>
                            {review.author.isVerified && (
                                <ShieldCheck className="w-4 h-4 text-accent-blue" />
                            )}
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                {formatDistanceToNow(new Date(review.timestamp), {
                    addSuffix: true,
                })}
              </span>
                        </div>
                    </div>

                    <div className="mt-1">
                        <StarRating rating={review.rating} size={16} />
                    </div>

                    {/* Content */}
                    <h4 className="font-semibold text-slate-900 dark:text-white mt-3 text-base leading-snug">
                        {review.title}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 whitespace-pre-wrap leading-relaxed">
                        {review.content}
                    </p>

                    {/* Helpful Section */}
                    <div className="flex items-center gap-3 mt-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Was this helpful?
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleVote("yes")}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                                    voted === "yes"
                                        ? "text-green-500 bg-green-500/10"
                                        : "text-slate-500 hover:text-green-500 hover:bg-slate-100 dark:hover:bg-dark-border/60"
                                }`}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-xs font-semibold">{helpful.yes}</span>
                            </button>

                            <button
                                onClick={() => handleVote("no")}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                                    voted === "no"
                                        ? "text-red-500 bg-red-500/10"
                                        : "text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-dark-border/60"
                                }`}
                            >
                                <ThumbsDown className="w-4 h-4" />
                                <span className="text-xs font-semibold">{helpful.no}</span>
                            </button>
                        </div>
                    </div>

                    {/* Reply Section */}
                    {review.reply && (
                        <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-dark-border/40 border border-light-border dark:border-dark-border/60"
                        >
                            <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                {review.reply.author}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                {formatDistanceToNow(new Date(review.reply.timestamp), {
                                    addSuffix: true,
                                })}
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {review.reply.content}
                            </p>
                        </m.div>
                    )}
                </div>
            </div>
        </m.div>
    );
};

export default ReviewCard;
