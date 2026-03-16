import { Star, MessageSquareQuote } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Patient Reviews | Dr V Sivaraman MD Skin & VD Specialist | Pondicherry",
    description: "Read genuine success stories and reviews from our patients who achieved healthy, clear skin with Dr. V. Sivaraman.",
};

const reviews = [
    {
        id: 1,
        name: "Rahul S.",
        date: "2 months ago",
        text: "Dr. Sivaraman is exceptional. My acne cleared up beautifully within months. He took the time to explain exactly what was causing it and laid out a clear plan. The medications were effective and affordable.",
        rating: 5,
        platform: "Google"
    },
    {
        id: 2,
        name: "Priya M.",
        date: "4 months ago",
        text: "Best dermatologist in Pondicherry. The clinic is modern, exceptionally clean, and the staff are very polite. The laser hair removal treatment here is painless and highly effective. Very satisfied with the results.",
        rating: 5,
        platform: "Google"
    },
    {
        id: 3,
        name: "Karthik R.",
        date: "1 month ago",
        text: "Took PRP treatment here for severe hairfall. Seeing visible results in just two sessions. Highly recommend Dr. Sivaraman for his thorough professional approach and transparency regarding expected results.",
        rating: 5,
        platform: "Practo"
    },
    {
        id: 4,
        name: "Anjali K.",
        date: "5 months ago",
        text: "Had persistent pigmentation and melasma. The chemical peel sessions here worked wonders. Dr. Sivaraman's diagnosis is always precise.",
        rating: 5,
        platform: "Google"
    },
    {
        id: 5,
        name: "Suresh P.",
        date: "3 weeks ago",
        text: "Very experienced doctor. He doesn't prescribe unnecessary tests. Brought my daughter for a skin allergy, and it was resolved in a few days.",
        rating: 5,
        platform: "Practo"
    },
    {
        id: 6,
        name: "Deepa V.",
        date: "6 months ago",
        text: "Excellent service. Got my skin tag removed seamlessly with minor electrocautery. Painless procedure, no scarring. Thank you Doctor!",
        rating: 5,
        platform: "Google"
    }
];

export default function ReviewsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white py-16 md:py-24 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-yellow-100 text-yellow-600 rounded-full mb-6">
                        <Star className="h-8 w-8 fill-current" />
                        <Star className="h-8 w-8 fill-current" />
                        <Star className="h-8 w-8 fill-current" />
                        <Star className="h-8 w-8 fill-current" />
                        <Star className="h-8 w-8 fill-current" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Patient Success Stories</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Read what our patients have achieved through their personalized treatments.
                    </p>
                </div>
            </div>

            {/* Reviews Grid */}
            <section className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative group">
                                <MessageSquareQuote className="absolute top-6 right-6 h-10 w-10 text-slate-100 group-hover:text-blue-50 transition-colors" />
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                                </div>
                                <p className="text-gray-700 italic mb-6 relative z-10 text-lg leading-relaxed">
                                    "{review.text}"
                                </p>
                                <div className="mt-auto border-t border-slate-100 pt-6">
                                    <p className="font-bold text-slate-900">{review.name}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                                        <span>{review.date}</span>
                                        <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-semibold">{review.platform}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <a
                            href="https://maps.app.goo.gl/wBom8CxZB7fvgCuy9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Read More Reviews on Google
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
