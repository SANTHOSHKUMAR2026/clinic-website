import { ArrowRight, Microscope, Syringe, TestTube2, Zap, Palette, Scissors } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Skin & Hair Treatments | Dr V Sivaraman MD Skin & VD Specialist | Pondicherry",
    description: "Explore our comprehensive range of dermatological and cosmetic treatments including laser therapies, hair loss solutions, and acne care.",
};

const treatmentCategories = [
    {
        id: "general",
        title: "General Dermatology",
        icon: <Microscope className="h-6 w-6" />,
        items: [
            "Acne / Pimples Treatment",
            "Skin Allergy Treatment",
            "Eczema Treatment",
            "Psoriasis Treatment",
            "Fungal Infection Treatment",
            "Bacterial & Viral Skin Infections",
            "Urticaria (Hives) Treatment"
        ]
    },
    {
        id: "hair",
        title: "Hair & Scalp Treatments",
        icon: <Scissors className="h-6 w-6" />,
        items: [
            "Hair Loss Treatment",
            "Dandruff Treatment",
            "Alopecia Areata",
            "PRP Hair Treatment",
            "Hair Regrowth Therapy",
            "Scalp Infection Treatment",
            "Medical Treatment for Baldness"
        ]
    },
    {
        id: "cosmetic",
        title: "Cosmetic Dermatology",
        icon: <Palette className="h-6 w-6" />,
        items: [
            "Anti-Aging Treatment",
            "Botox Treatment & Fillers",
            "Skin Rejuvenation",
            "Skin Brightening Treatment",
            "Chemical Peels",
            "Dark Circle Treatment"
        ]
    },
    {
        id: "laser",
        title: "Advanced Laser Treatments",
        icon: <Zap className="h-6 w-6" />,
        items: [
            "Laser Hair Removal",
            "Laser Pigmentation Removal",
            "Laser Scar Treatment",
            "Laser Skin Rejuvenation",
            "Laser Mole & Wart Removal",
            "Laser Tattoo Removal"
        ]
    },
    {
        id: "procedures",
        title: "Specialized Procedures",
        icon: <Syringe className="h-6 w-6" />,
        items: [
            "Cryotherapy (Liquid Nitrogen)",
            "Electrocautery",
            "Skin Biopsy",
            "Intralesional Injections",
            "Dermatoscopy Skin Analysis"
        ]
    },
    {
        id: "pigmentation",
        title: "Pigmentation & Lesion",
        icon: <TestTube2 className="h-6 w-6" />,
        items: [
            "Melasma Treatment",
            "Hyperpigmentation Treatment",
            "Sun Tan Removal",
            "Mole & Skin Tag Removal",
            "Wart & Corn Removal"
        ]
    }
];

export default function TreatmentsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white py-16 md:py-24 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Treatments</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive diagnostic and therapeutic solutions for all your skin, hair, and nail concerns.
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <section className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {treatmentCategories.map((category) => (
                            <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="bg-[var(--color-primary)] p-6 text-white flex items-center space-x-4">
                                    <div className="bg-white/20 p-3 rounded-lg">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold">{category.title}</h2>
                                </div>
                                <div className="p-8">
                                    <ul className="space-y-4">
                                        {category.items.map((item, idx) => (
                                            <li key={idx} className="flex flex-start text-gray-700">
                                                <div className="h-2 w-2 rounded-full bg-[var(--color-primary)] mt-2 mr-3 flex-shrink-0"></div>
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8 pt-6 border-t border-slate-100">
                                        <Link href="/online-appointment" className="text-[var(--color-btn)] font-semibold flex items-center hover:text-[var(--color-primary)] transition-colors group">
                                            Book Consultation <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Layer */}
            <section className="bg-blue-900 py-16 text-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Unsure which treatment is right for you?</h2>
                    <p className="text-lg text-blue-200 mb-8">
                        Schedule a consultation. Dr. Sivaraman will assess your skin condition and recommend a personalized, evidence-based treatment plan.
                    </p>
                    <Link
                        href="/online-appointment"
                        className="inline-block bg-white text-[var(--color-btn)] px-8 py-4 rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
                    >
                        Book an Assessment
                    </Link>
                </div>
            </section>
        </div>
    );
}
