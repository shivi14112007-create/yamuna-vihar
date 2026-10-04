import React from 'react';
import { Users, Award, MapPin, Globe2 } from 'lucide-react';
import { ImpactStats } from '../types/index.ts';

interface CollectiveCommitmentProps {
  stats: ImpactStats;
  onTakePledge: () => void;
}

export const CollectiveCommitment: React.FC<CollectiveCommitmentProps> = ({ stats, onTakePledge }) => {
  const cards = [
    {
      label: "Citizens Pledged",
      value: stats.totalPledges,
      sub: "Solemn guardians of River Yamuna",
      icon: <Users className="w-8 h-8 text-sky-600" />,
      color: "from-sky-50 to-blue-50/40",
      borderColor: "border-sky-200"
    },
    {
      label: "Certificates Issued",
      value: stats.certificatesGenerated,
      sub: "Verified digital credentials generated",
      icon: <Award className="w-8 h-8 text-emerald-600" />,
      color: "from-emerald-50 to-teal-50/40",
      borderColor: "border-emerald-200"
    },
    {
      label: "Cities Represented",
      value: stats.uniqueCities,
      sub: "Across diverse Indian states & territories",
      icon: <MapPin className="w-8 h-8 text-amber-600" />,
      color: "from-amber-50 to-orange-50/40",
      borderColor: "border-amber-200"
    },
    {
      label: "States / UTs Active",
      value: stats.uniqueStates,
      sub: "Pan-Indian civic solidarity",
      icon: <Globe2 className="w-8 h-8 text-indigo-600" />,
      color: "from-indigo-50 to-purple-50/40",
      borderColor: "border-indigo-200"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0c2f4d] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Real-Time Database Records
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#0c2f4d] tracking-tight mt-3">
            Our Collective Commitment
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Live metrics calculated directly from the official pledge registry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.label}
                </span>
                <div className="p-2 bg-white rounded-xl shadow-xs">
                  {card.icon}
                </div>
              </div>

              <div>
                <span className="text-4xl sm:text-5xl font-black font-mono text-[#0c2f4d] tracking-tight">
                  {card.value}
                </span>
                <p className="text-xs text-slate-600 font-medium mt-2">
                  {card.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Small encouragement note */}
        <div className="mt-10 text-center bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-xl mx-auto flex items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-700 font-medium text-left">
            Be part of the growing movement to protect our sacred river.
          </p>
          <button
            onClick={onTakePledge}
            className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-4 py-2 rounded-lg text-xs font-bold transition shrink-0"
          >
            Join Now
          </button>
        </div>

      </div>
    </section>
  );
};
