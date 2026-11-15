import React, { useState } from 'react';
import { CalendarPlus, ChevronDown } from 'lucide-react';
import {
  IMAGES,
  WEDDING_CITY,
  WEDDING_DATE_DISPLAY,
  downloadWeddingIcs,
} from '../data/weddingData';
import { BotanicalDivider } from './BotanicalOrnament';

const HeroSection: React.FC = () => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#f7f9fb] py-14 sm:py-20 lg:py-24 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-3">
            The Wedding Celebration
          </p>

          <h1
            className="font-editorial font-semibold text-[#162b36] tracking-tight text-balance leading-[1.06] mb-5"
            style={{ fontSize: 'clamp(2.75rem, 5vw, 4.5rem)' }}
          >
            Fadil <span className="italic font-normal text-[#a85d66]">&amp;</span> Indhea
          </h1>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm text-[#4e6775] mb-6">
            <span>{WEDDING_DATE_DISPLAY}</span>
            <span aria-hidden="true">·</span>
            <span>{WEDDING_CITY}</span>
            <span aria-hidden="true">·</span>
            <span>08:00 WIB</span>
          </div>

          <BotanicalDivider className="lg:justify-start mb-7" />

          <blockquote className="mx-auto lg:mx-0 max-w-xl text-[#2b3d47] text-base sm:text-lg leading-relaxed mb-4">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan
            untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, serta
            Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
          </blockquote>
          <p className="text-xs sm:text-sm font-medium text-[#4e6775] mb-8">
            QS. Ar-Rum · Ayat 21
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a
              href="#acara"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#a85d66] hover:bg-[#924d56] px-6 py-3 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3b4a]"
            >
              <span>Lihat Detail Acara</span>
              <ChevronDown className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={downloadWeddingIcs}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#1f3b4a]/20 bg-white hover:bg-[#edf2f6] px-5 py-3 text-sm font-semibold text-[#1f3b4a] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a85d66]"
            >
              <CalendarPlus className="h-4 w-4 text-[#a85d66]" />
              <span>Simpan Tanggal</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 flex items-stretch">
          <div className="relative w-full min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] rounded-t-[200px] rounded-b-2xl border border-[#1f3b4a]/15 bg-[#edf2f6] p-3 shadow-sm">
            <div className="relative h-full w-full overflow-hidden rounded-t-[188px] rounded-b-xl bg-[#1f3b4a]">
              {!imgFailed ? (
                <img
                  src={IMAGES.coastal}
                  alt="Fadil dan Indhea berjalan bersama di tepi pantai saat senja"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center text-[#f7f9fb]">
                  <span className="font-editorial text-4xl italic text-[#e7c6ca] mb-2">
                    Fadil &amp; Indhea
                  </span>
                  <span className="text-sm text-[#d5e1e8]">{WEDDING_DATE_DISPLAY}</span>
                </div>
              )}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#162b36]/75 via-[#162b36]/25 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-5 inset-x-6 flex items-center justify-between text-xs text-[#f7f9fb]">
                <span className="font-medium tracking-wide">Menuju Hari Bahagia</span>
                <span className="tabular-nums text-[#e7c6ca]">04 · 04 · 2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
