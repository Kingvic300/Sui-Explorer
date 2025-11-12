import React, { useState } from "react";
import { Star } from "lucide-react";
import { useReviewContext } from "@/contexts/ReviewContext";

export const ReviewForm = () => {
    const { addReview } = useReviewContext();
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !content || rating === 0) return alert("All fields required.");

        const newReview = {
            id: Date.now(),
            author: { name, avatar: "/default-avatar.png", isVerified: false },
            title,
            content,
            rating,
            timestamp: new Date().toISOString(),
            helpful: { yes: 0, no: 0 },
        };

        addReview(newReview);
        setName("");
        setTitle("");
        setContent("");
        setRating(0);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-light-border dark:border-dark-border/60 rounded-xl p-4 bg-white dark:bg-dark-border/20"
        >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Leave a Review
            </h3>

            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Your name"
                    className="p-2 rounded-md border border-light-border dark:border-dark-border bg-transparent text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Title"
                    className="p-2 rounded-md border border-light-border dark:border-dark-border bg-transparent text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 cursor-pointer ${
                                i <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-400"
                            }`}
                            onClick={() => setRating(i)}
                        />
                    ))}
                </div>

                <textarea
                    placeholder="Write your review..."
                    rows={4}
                    className="p-2 rounded-md border border-light-border dark:border-dark-border bg-transparent text-sm resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-accent-blue text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-accent-blue/90 transition"
                >
                    Submit Review
                </button>
            </div>
        </form>
    );
};
