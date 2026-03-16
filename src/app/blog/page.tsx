import { CalendarDays, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Skin Care Blog & Articles | Dr V Sivaraman MD Skin & VD Specialist",
    description: "Read expert articles and tips on skin care, hair health, and dermatological procedures by Dr. V. Sivaraman.",
};

const blogPosts = [
    {
        id: 1,
        title: "Understanding Adult Acne: Causes and Treatments",
        excerpt: "Acne isn't just for teenagers. Discover why adult acne happens and the modern treatments available to clear it for good.",
        date: "March 10, 2026",
        author: "Dr. V. Sivaraman",
        category: "Skin Care",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "PRP for Hair Loss: Does it Really Work?",
        excerpt: "Platelet-Rich Plasma (PRP) therapy is gaining popularity. Learn how it uses your body's own healing properties to stimulate hair growth.",
        date: "February 24, 2026",
        author: "Dr. V. Sivaraman",
        category: "Hair Care",
        image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "The Ultimate Guide to Sunscreen for Indian Skin Types",
        excerpt: "Choosing the right sunscreen can prevent pigmentation and aging. Here is everything you need to know about SPF and UVA/UVB protection.",
        date: "February 05, 2026",
        author: "Dr. V. Sivaraman",
        category: "Preventative",
        image: "https://images.unsplash.com/photo-1598440947619-2ce6afe5dc49?auto=format&fit=crop&w=600&q=80"
    }
];

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white py-16 md:py-24 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Skin & Hair Care Blog</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Expert insights, practical tips, and latest medical advancements in dermatology.
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur text-[var(--color-primary)] text-sm px-3 py-1 font-bold rounded-full shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                                        <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" /> {post.date}</span>
                                        <span className="flex items-center"><User className="h-4 w-4 mr-1.5" /> {post.author}</span>
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <span className="inline-flex items-center text-[var(--color-btn)] font-semibold text-sm group-hover:text-[var(--color-primary)]">
                                            Read full article <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
}
