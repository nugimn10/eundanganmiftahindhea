import React, { useState } from 'react';
import { MailOpen } from 'lucide-react';
import { IMAGES, WEDDING_CITY, WEDDING_DATE_DISPLAY } from '../data/weddingData';
import { BotanicalCorner, BotanicalDivider } from './BotanicalOrnament';

interface SplashScreenProps {
  guestName: string;
  onOpen: () => void;
}

type EnvelopeStage = 'sealed' | 'opening' | 'rising';

const SplashScreen: React.FC<SplashScreenProps> = ({ guestName, onOpen }) => {
  const [stage, setStage] = useState<EnvelopeStage>('sealed');
  const [imgFailed, setImgFailed] = useState(false);

  const handleOpen = () => {
    if (stage !== 'sealed') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setStage('rising');
      setTimeout(onOpen, 220);
      return;
    }

    setStage('opening');
    setTimeout(() => {
      setStage('rising');
    }, 340);
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  const isFlapOpen = stage === 'opening' || stage === 'rising';
  const isRising = stage === 'rising';

  return (
    <section
      id="cover"
      aria-label="Sampul Undangan Pernikahan"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 bg-[#162b36] text-[#f7f9fb] transition-opacity duration-500 ${
        isRising ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {!imgFailed && (
        <img
          src={IMAGES.cover}
          alt="Dekorasi bunga mawar dan lautan senja"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
            isRising ? 'scale-105' : 'scale-100'
          }`}
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#132630]/82 via-[#162b36]/74 to-[#0f1f28]/92"
        aria-hidden="true"
      />

      <div className="envelope-scene relative z-10 w-full max-w-lg pt-8 sm:pt-10">
        <div
          className={`relative rounded-2xl border border-[#f7f9fb]/25 bg-[#1a3340]/92 shadow-2xl transition-all duration-500 ease-out ${
            isRising ? 'translate-y-8 opacity-0 scale-[0.97]' : 'translate-y-0 opacity-100 scale-100'
          }`}
        >
          {/* 3D Top Envelope Flap */}
          <div
            aria-hidden="true"
            className={`envelope-flap pointer-events-none absolute -top-px inset-x-0 z-20 h-28 sm:h-32 ${
              isFlapOpen ? 'envelope-flap-open' : ''
            }`}
          >
            <svg
              viewBox="0 0 400 112"
              preserveAspectRatio="none"
              className="h-full w-full drop-shadow-md"
            >
              <path
                d="M 0 12 Q 0 0 12 0 L 388 0 Q 400 0 400 12 L 208 98 Q 200 102 192 98 Z"
                fill={isFlapOpen ? '#244252' : '#1f3b4a'}
                stroke="rgba(231, 198, 202, 0.35)"
                strokeWidth="1.2"
              />
            </svg>

            {/* Dusty Rose Wax Seal */}
            <button
              type="button"
              tabIndex={-1}
              onClick={handleOpen}
              className={`pointer-events-auto absolute left-1/2 bottom-1 -translate-x-1/2 translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#e7c6ca]/70 bg-[#a85d66] text-[#f7f9fb] shadow-lg transition-all duration-300 cursor-pointer ${
                isFlapOpen ? 'scale-75 opacity-0' : 'scale-100 opacity-100 hover:scale-105'
              }`}
              aria-hidden="true"
            >
              <span className="font-editorial text-lg font-semibold tracking-wider">F&amp;I</span>
            </button>
          </div>

          {/* Inner Pearl-Ivory Invitation Card rising out of envelope */}
          <div
            className={`relative z-10 mx-3 sm:mx-5 mt-14 sm:mt-16 mb-4 sm:mb-5 rounded-xl border border-[#1f3b4a]/15 bg-[#f7f9fb] text-[#162b36] px-5 pt-12 pb-8 sm:px-9 sm:pt-14 sm:pb-10 text-center shadow-lg transition-all duration-500 ease-out ${
              isRising
                ? '-translate-y-12 scale-[1.03] shadow-2xl'
                : isFlapOpen
                  ? '-translate-y-3'
                  : 'translate-y-0'
            }`}
          >
            <BotanicalCorner position="top-left" variant="dark" />
            <BotanicalCorner position="top-right" variant="dark" />
            <BotanicalCorner position="bottom-left" variant="dark" />
            <BotanicalCorner position="bottom-right" variant="dark" />

            <p className="text-xs tracking-[0.22em] uppercase text-[#a85d66] mb-3 font-semibold">
              Undangan Pernikahan
            </p>

            <h1 className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight text-[#162b36] text-balance leading-[1.08] mb-2.5">
              Fadhil <span className="italic font-normal text-[#a85d66]">&amp;</span> Indhea
            </h1>

            <p className="text-xs sm:text-sm text-[#4e6775] mb-5">
              {WEDDING_DATE_DISPLAY} <span aria-hidden="true">·</span> {WEDDING_CITY}
            </p>

            <BotanicalDivider variant="dark" className="mb-6" />

            <div className="mx-auto max-w-sm rounded-xl border border-[#1f3b4a]/12 bg-[#edf2f6]/80 px-4 py-3.5 mb-7">
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#4e6775] mb-1">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <p className="font-editorial text-2xl sm:text-3xl font-semibold text-[#162b36] truncate">
                {guestName}
              </p>
              <p className="text-xs text-[#4e6775] mt-1">
                Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpen}
              disabled={stage !== 'sealed'}
              className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg bg-[#a85d66] hover:bg-[#924d56] active:scale-[0.98] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3b4a] whitespace-nowrap cursor-pointer disabled:opacity-80"
            >
              <MailOpen className="h-4 w-4 shrink-0" />
              <span>Buka Undangan</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplashScreen;