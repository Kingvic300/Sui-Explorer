import React from "react";
import { ReviewForm } from "@/components/projects/ReviewForm";
import ReviewCard from "@/components/projects/ReviewCard";
import { useReviewContext } from "@/contexts/ReviewContext";

const ReviewsSection = () => {
    const { reviews } = useReviewContext();

    return (
        <section className="space-y-6">
            <ReviewForm />
            {reviews.length > 0 ? (
                reviews.map((r) => <ReviewCard key={r.id} review={r} />)
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    No reviews yet. Be the first!
                </p>
            )}
        </section>
    );
};

export default ReviewsSection;
