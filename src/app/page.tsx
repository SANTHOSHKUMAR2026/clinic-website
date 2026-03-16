import Link from "next/link";
import { ArrowRight, Star, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function Home() {
  const services = [
    { title: "Acne Treatment", desc: "Expert care for clear, blemish-free skin using advanced dermatology." },
    { title: "Hair Loss Therapy", desc: "PRP and medical treatments to restore hair growth and scalp health." },
    { title: "Laser Treatments", desc: "Safe laser hair removal, pigmentation correction, and scar reduction." },
    { title: "Anti-Aging", desc: "Botox, fillers, and skin rejuvenation for a youthful appearance." },
  ];

  const reviews = [
    { name: "Rahul S.", text: "Dr. Sivaraman is exceptional. My acne cleared up beautifully within months.", rating: 5 },
    { name: "Priya M.", text: "Best dermatologist in Pondicherry. The clinic is modern and staff are very polite.", rating: 5 },
    { name: "Karthik R.", text: "Took PRP treatment here. Seeing visible results. Highly recommend Dr. Sivaraman.", rating: 5 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-20 lg:py-32 overflow-hidden">
        {/* Soft Skin Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.5] pointer-events-none"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="z-20 max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-[var(--color-primary)] text-sm font-semibold mb-6">
              Expert Dermatologist in Pondicherry
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold text-slate-900 leading-tight mb-8">
              Healthy, Clear & <br className="hidden md:block" />
              <span className="text-[var(--color-primary)]">Confident Skin</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Dr. V. Sivaraman offers advanced clinical and cosmetic dermatology treatments with 30+ years of trusted experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/online-appointment"
                className="bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white px-8 py-4 rounded-lg font-bold text-center transition-all shadow-lg hover:shadow-xl flex items-center justify-center group text-lg"
              >
                Book Appointment <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/treatments"
                className="bg-white border-2 border-slate-200 hover:border-[var(--color-primary)] text-slate-700 px-8 py-4 rounded-lg font-bold text-center transition-all hover:text-[var(--color-primary)] flex items-center justify-center text-lg"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive Skin Care</h2>
            <p className="text-gray-600 text-lg">We offer a wide range of dermatological and cosmetic treatments using state-of-the-art technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-blue-100 text-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.desc}</p>
                <Link href="/treatments" className="text-[var(--color-primary)] font-semibold flex items-center hover:opacity-80">
                  Read more <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Doctor Short Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              30+ Years of Excellence in Dermatology
            </h2>
            <p className="text-gray-600 leading-relaxed text-2xl max-w-4xl mx-auto">
              Dr. V. Sivaraman is a leading dermatologist in Pondicherry known for providing advanced skin, hair, and cosmetic dermatology treatments. He offers evidence-based and patient-focused care for all dermatological conditions.
            </p>
            <div className="space-y-6 pt-6 text-center flex flex-col items-center">
              <div className="flex items-center space-x-4 w-fit">
                <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                <span className="text-slate-700 font-medium text-xl">Expert Consultation & Diagnosis</span>
              </div>
              <div className="flex items-center space-x-4 w-fit">
                <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                <span className="text-slate-700 font-medium text-xl">Modern Dermatology Technology</span>
              </div>
              <div className="flex items-center space-x-4 w-fit">
                <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                <span className="text-slate-700 font-medium text-xl">Personalized Skin Care Solutions</span>
              </div>
            </div>
            <div className="pt-10 flex justify-center">
              <Link
                href="/doctor"
                className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white px-10 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:bg-blue-800 transition-all transform hover:-translate-y-1 w-full sm:w-auto"
              >
                Meet Dr. V. Sivaraman
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Patients Say</h2>
            <p className="text-gray-600 text-lg">Real reviews from our patients in Pondicherry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg relative">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                <p className="font-bold text-slate-900">- {review.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://maps.app.goo.gl/wBom8CxZB7fvgCuy9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              View more reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* CTA / Contact / Map */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Book Your Visit Today</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-lg">
                Don't wait to get the skin care you deserve. Schedule an appointment with Dr. Sivaraman at our Puducherry clinic.
              </p>

              <div className="bg-white/10 p-6 rounded-xl border border-white/10 mb-8 max-w-md">
                <h3 className="font-bold text-xl mb-4 flex items-center"><Clock className="mr-2 h-5 w-5" /> Visit Timings</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="flex justify-between"><span>Mon, Thu, Sat:</span> <span className="font-semibold text-white">2:00 PM - 8:00 PM</span></p>
                  <p className="flex justify-between"><span>Tue, Wed, Fri, Sun:</span> <span className="font-semibold text-white">4:00 PM - 8:00 PM</span></p>
                </div>
              </div>

              <Link
                href="/online-appointment"
                className="inline-block bg-[var(--color-btn)] hover:bg-[var(--color-btn-hover)] text-white px-8 py-4 rounded-lg font-bold text-center transition-all shadow-lg hover:shadow-2xl"
              >
                Book Appointment Online
              </Link>
            </div>

            <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15615.158373307525!2d79.81516898715822!3d11.93239550000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a536181e0e89af7%3A0x5f57fb9b3920ac7!2sDr%20V%20Sivaraman%20MD%20Skin%20%26%20VD%20Specialist!5e0!3m2!1sen!2sin!4v1709458299104!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Map Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
