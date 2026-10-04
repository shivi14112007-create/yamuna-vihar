import React from 'react';
import { UserCheck, HeartHandshake, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Enter Your Details",
      desc: "Provide your name, location, and optional institution. Every participant is cataloged with an official cryptographic ID.",
      icon: <UserCheck className="w-6 h-6 text-[#0c2f4d]" />
    },
    {
      num: "02",
      title: "Take the Pledge",
      desc: "Read the official sacred declaration to defend River Yamuna and solemnly affirm your commitment to zero litter and eco-friendly practices.",
      icon: <HeartHandshake className="w-6 h-6 text-emerald-700" />
    },
    {
      num: "03",
      title: "Receive Your Certificate",
      desc: "Instantly view and download your personalized, high-resolution A4 landscape e-certificate with a verifiable QR code.",
      icon: <Award className="w-6 h-6 text-amber-600" />
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0c2f4d] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Citizen Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#0c2f4d] tracking-tight mt-3">
            How It Works
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Three simple steps to stand as a recognized guardian of nature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-slate-200 -z-0"></div>

          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative z-10 hover:shadow-md transition text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 relative shadow-xs">
                {s.icon}
                <span className="absolute -top-2 -right-2 bg-[#0c2f4d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono">
                  {s.num}
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
