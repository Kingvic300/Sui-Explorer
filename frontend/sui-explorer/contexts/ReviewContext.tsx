import type { Review } from "@/types/index.ts";

type ReviewContextType = {
    reviews: Review[];
    addReview: (review: Review) => void;
    updateHelpful: (id: number, type: "yes" | "no") => void;
};

const ReviewContext = React.createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    const addReview = (review: Review) => {
        setReviews((prev) => [review, ...prev]);
    };

    const updateHelpful = (id: number, type: "yes" | "no") => {
        setReviews((prev) =>
            prev.map((r) =>
                r.id === id
                    ? {
                        ...r,
                        helpful: {
                            ...r.helpful,
                            [type]: r.helpful[type] + 1,
                        },
                    }
                    : r
            )
        );
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview, updateHelpful }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviewContext = () => {
    const context = React.useContext(ReviewContext);
    if (!context) throw new Error("useReviewContext must be used within ReviewProvider");
    return context;
};
