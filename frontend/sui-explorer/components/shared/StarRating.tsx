import React from "react";
import { StarIcon } from "lucide-react";

export interface StarRatingProps {
    rating: number;
    size?: number;
    editable?: boolean;
    onChange?: (value: number) => void;
}

export const StarRating:
    React.FC<StarRatingProps> = ({
    rating,
    size = 20,
        editable = false,
                                                          onChange,
                                                      }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => {
                const filled = star <= rating;
                const half = !filled && star - rating < 1;

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => editable && onChange && onChange(star)}
                        className={`transition-colors ${
                            editable ? "cursor-pointer hover:scale-110" : "cursor-default"
                        }`}
                    >
                        <StarIcon
                            className={`w-[${size}px] h-[${size}px] ${
                                filled
                                    ? "text-yellow-400 fill-yellow-400"
                                    : half
                                        ? "text-yellow-400/60 fill-yellow-400/60"
                                        : "text-slate-300 dark:text-slate-600"
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};
