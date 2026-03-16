import { CheckCircle2, Award, Clock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Clinic | Dr V Sivaraman MD Skin & VD Specialist | Pondicherry",
    description: "Learn about Dr V Sivaraman MD Skin & VD Specialist, a trusted skin care center in Puducherry offering comprehensive diagnosis and treatment.",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <div className="bg-slate-50 py-16 md:py-24 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About Our Clinic</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A trusted skin care center in Puducherry dedicated to helping you achieve healthy, clear, and confident skin.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Trusted Dermatology Care in Puducherry</h2>
                            <div className="prose prose-lg text-gray-600">
                                <p className="mb-4">
                                    Dr V Sivaraman MD Skin & VD Specialist Clinic is a premier skin care center offering comprehensive diagnosis and treatment for skin, hair, and nail conditions.
                                </p>
                                <p className="mb-4">
                                    Founded by Dr. V. Sivaraman, the clinic provides expert care for acne, pigmentation, hair loss, skin allergies, and other dermatological concerns. We also offer advanced cosmetic dermatology services such as laser hair removal, chemical peels, and skin rejuvenation.
                                </p>
                                <p>
                                    With modern technology and personalized care, our completely patient-centric approach ensures safe, effective, and tailored treatments for all age groups.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-6">
                                <div className="bg-blue-50 p-6 rounded-2xl">
                                    <Award className="h-8 w-8 text-[var(--color-primary)] mb-3" />
                                    <h3 className="font-bold text-xl text-slate-900 mb-1">30+ Years</h3>
                                    <p className="text-sm text-gray-600">Of Clinical Experience</p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-2xl">
                                    <CheckCircle2 className="h-8 w-8 text-[var(--color-primary)] mb-3" />
                                    <h3 className="font-bold text-xl text-slate-900 mb-1">Modern Tech</h3>
                                    <p className="text-sm text-gray-600">Advanced Laser Systems</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 mt-8">
                                {/* Quote 1 */}
                                <div className="relative rounded-2xl shadow-md w-full h-64 overflow-hidden flex items-center justify-center p-6 text-center group">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
                                    <div className="absolute inset-0 bg-[var(--color-primary)]/80 backdrop-blur-md"></div>
                                    <p className="relative z-10 text-white font-black text-xl md:text-2xl leading-snug drop-shadow-md tracking-wide">
                                        "Invest in your skin. It is going to represent you for a very long time."
                                    </p>
                                </div>
                                {/* Quote 2 */}
                                <div className="relative rounded-2xl shadow-md w-full h-48 overflow-hidden flex items-center justify-center p-6 text-center group">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
                                    <div className="absolute inset-0 bg-[var(--color-primary)]/80 backdrop-blur-md"></div>
                                    <p className="relative z-10 text-white font-black text-lg md:text-xl leading-snug drop-shadow-md tracking-wide">
                                        "Healthy skin is a reflection of overall wellness."
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {/* Quote 3 */}
                                <div className="relative rounded-2xl shadow-md w-full h-48 overflow-hidden flex items-center justify-center p-6 text-center group">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
                                    <div className="absolute inset-0 bg-[var(--color-primary)]/80 backdrop-blur-md"></div>
                                    <p className="relative z-10 text-white font-black text-lg md:text-xl leading-snug drop-shadow-md tracking-wide">
                                        "Beautiful skin requires commitment, not a miracle."
                                    </p>
                                </div>
                                {/* Quote 4 */}
                                <div className="relative rounded-2xl shadow-md w-full h-64 overflow-hidden flex items-center justify-center p-6 text-center group">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
                                    <div className="absolute inset-0 bg-[var(--color-primary)]/80 backdrop-blur-md"></div>
                                    <p className="relative z-10 text-white font-black text-xl md:text-2xl leading-snug drop-shadow-md tracking-wide">
                                        "Your skin is your best accessory. Take good care of it."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values / Why Choose Us */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                            <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mb-6">
                                <Award className="h-7 w-7 text-blue-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Expert Diagnosis</h3>
                            <p className="text-gray-400">Accurate clinical diagnosis using decades of experience to treat the root cause, not just symptoms.</p>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                            <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-7 w-7 text-blue-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Holistic Solutions</h3>
                            <p className="text-gray-400">We blend medical, surgical, and cosmetic dermatology to offer comprehensive solutions for your skin concerns.</p>
                        </div>

                        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                            <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mb-6">
                                <Clock className="h-7 w-7 text-blue-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Patient Priority</h3>
                            <p className="text-gray-400">Convenient appointment slots and high ethical standards ensuring your safety and comfort are paramount.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-blue-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to regain your glow?</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Consult with Dr. Sivaraman to get an evidence-based tailored treatment plan.
                    </p>
                    <Link
                        href="/online-appointment"
                        className="inline-block bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white px-8 py-4 rounded-lg font-bold shadow-lg transition-colors text-lg"
                    >
                        Schedule Consultation Today
                    </Link>
                </div>
            </section>
        </div>
    );
}
