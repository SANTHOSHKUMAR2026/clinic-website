import { CheckCircle2, GraduationCap, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { DynamicFee, DynamicWorkingHours } from "@/components/ClinicInfo";
export const metadata: Metadata = {
    title: "Doctor Profile | Dr V Sivaraman MD Skin & VD Specialist | Pondicherry",
    description: "Learn more about Dr. V. Sivaraman, leading MD Skin & VD Specialist with 30+ years of experience in clinical and cosmetic dermatology.",
};

export default function DoctorPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <div className="bg-slate-50 py-16 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Dr. V. Sivaraman</h1>
                    <p className="text-lg text-[var(--color-primary)] font-semibold">MD Skin & VD Specialist | Consultant Dermatologist & Cosmetologist</p>
                </div>
            </div>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Left Column: Image & Quick Info */}
                        <div className="lg:col-span-4 space-y-8 sticky top-32">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-slate-200">
                                <img
                                    src="/doctor-sivaraman.png"
                                    alt="Dr. V. Sivaraman"
                                    className="w-full h-full object-cover grayscale-[20%]"
                                />
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-slate-900 border-b pb-2">Consultation Details</h3>
                                <ul className="space-y-4 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <GraduationCap className="h-5 w-5 text-[var(--color-primary)] mr-3 flex-shrink-0" />
                                        <span>Experience: <strong className="text-slate-900">30+ Years</strong></span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)] mr-3 flex-shrink-0" />
                                        <span>Consultation Fee: <strong className="text-slate-900"><DynamicFee /></strong></span>
                                    </li>
                                    <li className="flex items-start">
                                        <MapPin className="h-5 w-5 text-[var(--color-primary)] mr-3 flex-shrink-0" />
                                        <span>Pondicherry Clinic</span>
                                    </li>
                                </ul>
                                <DynamicWorkingHours />
                                <div className="mt-6">
                                    <Link href="/online-appointment" className="block w-full text-center bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white px-4 py-3 rounded-lg font-bold transition-colors">
                                        Book Appointment
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Bio & Experience */}
                        <div className="lg:col-span-8">
                            <div className="prose prose-lg max-w-none text-gray-600">
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">About The Doctor</h2>
                                <p>
                                    Dr. V. Sivaraman is a leading dermatologist in Pondicherry widely recognized for providing advanced skin, hair, and cosmetic dermatology treatments.
                                </p>
                                <p>
                                    With extensive experience treating severe acne, pigmentation, persistent hair loss, skin allergies, and complex dermatological conditions, he offers evidence-based and patient-focused care. His highly analytical approach ensures that patients receive the exact treatment suitable for their unique skin types and conditions.
                                </p>
                                <p>
                                    Dr. Sivaraman's clinic in Puducherry is equipped with modern dermatology tech, facilitating procedures such as laser hair removal, anti-aging therapies, wart removal, and intricate pigmentation correction.
                                </p>

                                <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Areas of Expertise</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                    {[
                                        "Clinical Dermatology",
                                        "Aesthetic & Cosmetic Procedures",
                                        "Laser Skin Treatments",
                                        "Hair & Scalp Specialists (PRP)",
                                        "Dermatoscopy & Skin Analysis",
                                        "Pediatric Dermatology",
                                        "Minor Surgical Procedures",
                                        "Anti-Aging Treatments"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mr-3"></div>
                                            <span className="font-medium text-slate-800">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 bg-blue-50 p-8 rounded-2xl border-l-4 border-[var(--color-primary)]">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 mt-0">My Commitment to Patients</h3>
                                    <p className="italic mb-0">
                                        "My goal is to deliver safe, effective, and truly personalized skin care solutions. Dermatology is not just about treating symptoms, but fundamentally improving the health of the skin so that every patient can walk out with renewed self-esteem and confidence."
                                    </p>
                                    <p className="font-bold text-slate-900 mt-4">- Dr. V. Sivaraman</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
