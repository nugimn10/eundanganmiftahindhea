import React from 'react';
import { LOVE_STORY } from '../data/weddingData';
import { BotanicalDivider } from './BotanicalOrnament';

const LoveStory: React.FC = () => {
  return (
    <section id="kisah" className="bg-[#faf5f6] py-16 sm:py-24 px-4 sm:px-6 border-y border-[#1f3b4a]/8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-3">
            Perjalanan Cinta
          </p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#162b36] mb-4 text-balance">
            Kisah Kasih Kami
          </h2>
          <p className="text-sm sm:text-base text-[#4e6775] leading-relaxed">
            Setiap langkah kecil mempertemukan kami pada waktu yang paling tepat, hingga akhirnya
            berlabuh dalam ikatan pernikahan.
          </p>
          <BotanicalDivider className="mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LOVE_STORY.map((item) => (
            <article
              key={item.chapter}
              className="rounded-2xl border border-[#1f3b4a]/10 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 border-b border-[#1f3b4a]/10 pb-3 mb-4">
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#a85d66] tabular-nums">
                    Bab {item.chapter}
                  </span>
                  <span className="text-xs font-medium text-[#4e6775] tabular-nums">
                    Tahun {item.year}
                  </span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#162b36] mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-[#4e6775] leading-relaxed">
                  {item.narrative}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoveStory;
