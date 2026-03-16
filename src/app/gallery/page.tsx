import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Before & After Gallery | Dr V Sivaraman MD Skin & VD Specialist | Pondicherry",
    description: "Real results from real patients. View our clinical before and after gallery for various dermatological treatments.",
};

const galleryImages = [
    { id: 1, category: "Acne Treatment", image: "/gallery_acne_1773116771411.png" },
    { id: 2, category: "Laser Skin Rejuvenation", image: "/gallery_laser_1773116791878.png" },
    { id: 3, category: "Pigmentation Correction", image: "/gallery_pigmentation_1773116807568.png" },
    { id: 4, category: "Hair PRP Therapy", image: "/gallery_hair_1773116822436.png" },
    { id: 5, category: "Anti-Aging Aesthetics", image: "/gallery_aging_1773116839538.png" },
    { id: 6, category: "Chemical Peels", image: "/gallery_peel_1773116854964.png" },
];

export default function GalleryPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <div className="bg-slate-50 py-16 md:py-24 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Before & After Gallery</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Witness the transformations. Real results achieved through our personalized, evidence-based dermatological care.
                    </p>
                </div>
            </div>

            {/* Gallery Grid */}
            <section className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryImages.map((item) => (
                            <div key={item.id} className="group overflow-hidden rounded-2xl shadow-sm border border-slate-200">
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={item.image}
                                        alt={item.category}
                                        className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Overlay tags for Before / After */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <span className="bg-white/20 backdrop-blur text-white text-sm px-3 py-1 rounded-full font-medium inline-block mb-3 border border-white/30">
                                            {item.category}
                                        </span>
                                        <div className="flex justify-between items-center text-white/90 font-bold text-sm tracking-widest uppercase">
                                            <span>Before</span>
                                            <span className="h-0.5 flex-grow bg-white/30 mx-4"></span>
                                            <span>After</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center text-gray-500 max-w-3xl mx-auto bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <p className="text-sm leading-relaxed">
                            <span className="font-semibold text-slate-700">Disclaimer:</span> The images shown above are highly realistic AI-generated representations. Because we strictly value and protect individual patient privacy and confidentiality, actual patient photos cannot be shared online. These images accurately represent the typical output and results you can expect from these specific clinical treatments at our facility.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
