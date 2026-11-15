import React, { useState } from 'react';
import { MailOpen } from 'lucide-react';
import { IMAGES, WEDDING_CITY, WEDDING_DATE_DISPLAY } from '../data/weddingData';
import { BotanicalCorner, BotanicalDivider } from './BotanicalOrnament';

interface SplashScreenProps {
  guestName: string;
  onOpen: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ guestName, onOpen }) => {
  const [fading, setFading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleOpen = () => {
    if (fading) return;
    setFading(true);
    setTimeout(onOpen, 600);
  };

  return (
    <section
      id="cover"
      aria-label="Sampul Undangan Pernikahan"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 bg-[#162b36] text-[#f7f9fb] transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {!imgFailed && (
        <img
          src={IMAGES.cover}
          alt="Dekorasi bunga mawar dan lautan senja"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#132630]/80 via-[#162b36]/70 to-[#0f1f28]/90"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl rounded-t-[180px] rounded-b-2xl border border-[#f7f9fb]/25 bg-[#162b36]/65 backdrop-blur-md px-6 py-12 sm:px-12 sm:py-16 text-center shadow-2xl">
        <BotanicalCorner position="top-left" variant="light" />
        <BotanicalCorner position="top-right" variant="light" />
        <BotanicalCorner position="bottom-left" variant="light" />
        <BotanicalCorner position="bottom-right" variant="light" />

        <p className="text-xs sm:text-sm tracking-[0.22em] uppercase text-[#e7c6ca] mb-4 font-medium">
          Undangan Pernikahan
        </p>

        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#e7c6ca]/45 font-editorial text-lg tracking-wider text-[#f7f9fb]">
          F&amp;I
        </div>

        <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#f7f9fb] text-balance leading-[1.08] mb-3">
          Fadhil <span className="italic font-normal text-[#e7c6ca]">&amp;</span> Indhea
        </h1>

        <p className="text-sm sm:text-base text-[#d5e1e8] mb-6">
          {WEDDING_DATE_DISPLAY} <span aria-hidden="true">·</span> {WEDDING_CITY}
        </p>

        <BotanicalDivider variant="light" className="mb-7" />

        <div className="mx-auto max-w-sm rounded-xl border border-[#f7f9fb]/15 bg-[#0f1f28]/55 px-5 py-4 mb-8">
          <p className="text-xs tracking-[0.14em] uppercase text-[#b8ccd6] mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <p className="font-editorial text-2xl sm:text-3xl font-medium text-[#f7f9fb] truncate">
            {guestName}
          </p>
          <p className="text-xs text-[#b8ccd6] mt-1">
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg bg-[#a85d66] hover:bg-[#924d56] active:scale-[0.98] px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7c6ca] whitespace-nowrap cursor-pointer"
        >
          <MailOpen className="h-4 w-4 shrink-0" />
          <span>Buka Undangan</span>
        </button>
      </div>
    </section>
  );
};

export default SplashScreen;