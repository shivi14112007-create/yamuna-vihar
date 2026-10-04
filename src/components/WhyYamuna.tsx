import React from 'react';
import { Droplet, HeartHandshake, Trees, ShieldAlert } from 'lucide-react';

export const WhyYamuna: React.FC = () => {
  const pillars = [
    {
      icon: <Droplet className="w-6 h-6 text-sky-600" />,
      title: "Lifeline for 57+ Million People",
      description: "Originating at the sacred Yamunotri glacier, the Yamuna provides more than 70% of drinking water for India's capital region and irrigates millions of hectares of agricultural land across Uttarakhand, Himachal, Haryana, Delhi, and Uttar Pradesh."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-amber-600" />,
      title: "Vibrant Cultural & Sacred Dignity",
      description: "Revered as the goddess daughter of Surya and sister of Yama, the Yamuna represents millennia of Indian literature, devotion, and civilization. Protecting her is not merely ecological duty; it is our sacred cultural heritage."
    },
    {
      icon: <Trees className="w-6 h-6 text-emerald-600" />,
      title: "Biodiversity & Natural Sanctuaries",
      description: "Her banks and floodplains are home to endangered freshwater gharials, river turtles, native fish species, and hundreds of migratory bird populations that depend on unpolluted riparian ecosystems."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
      title: "The Crisis & Collective Action",
      description: "Untreated municipal effluents, toxic chemical discharge, and discarded single-use plastics have choked stretches of this great river. Genuine restoration demands active citizen vigilance and everyday zero-waste discipline."
    }
  ];

  return (
    <section id="why-yamuna" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0c2f4d] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Heritage & Ecology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#0c2f4d] tracking-tight mt-3">
            Why the Yamuna Matters
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            The Yamuna is not merely water; she is our lifeline, our history, and the earth that sustains us. To choke her with pollution is to dishonor our own civilization.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-[#0c2f4d]/30 transition shadow-xs hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-serif mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pillar {idx + 1} of Environmental Duty
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
