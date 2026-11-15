import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, MailOpen } from 'lucide-react';
import { IMAGES, WEDDING_CITY, WEDDING_DATE_DISPLAY } from '../data/weddingData';
import { BotanicalCorner, BotanicalDivider } from './BotanicalOrnament';

interface SplashScreenProps {
  guestName: string;
  onStartOpening?: () => void;
  onOpen: () => void;
}

type CoverStage = 'sealed' | 'opening' | 'card-revealed' | 'entering';

const SplashScreen: React.FC<SplashScreenProps> = ({
  guestName,
  onStartOpening,
  onOpen,
}) => {
  const [stage, setStage] = useState<CoverStage>('sealed');
  const [isPaperRising, setIsPaperRising] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  const handleOpenEnvelope = () => {
    if (stage !== 'sealed') return;

    onStartOpening?.();

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsPaperRising(true);
      setStage('card-revealed');
      return;
    }

    setStage('opening');
    schedule(() => {
      setIsPaperRising(true);
    }, 220);
    schedule(() => {
      setStage('card-revealed');
    }, 820);
  };

  const handleEnterInvitation = () => {
    if (stage !== 'card-revealed') return;

    onStartOpening?.();

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      onOpen();
      return;
    }

    setStage('entering');
    schedule(() => {
      onOpen();
    }, 380);
  };

  const isFlapOpen = stage === 'opening' || stage === 'card-revealed' || stage === 'entering';
  const isCardVisible = stage === 'card-revealed' || stage === 'entering';
  const isEnteringMain = stage === 'entering';

  return (
    <section
      id="cover"
      aria-label="Sampul Undangan Pernikahan"
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 bg-[#162b36] text-[#f7f9fb] transition-opacity duration-400 ${
        isEnteringMain ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {!imgFailed && (
        <img
          src={IMAGES.cover}
          alt="Dekorasi bunga mawar dan lautan senja"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className={`fixed inset-0 h-full w-full object-cover transition-transform duration-700 ${
            isCardVisible ? 'scale-105' : 'scale-100'
          }`}
        />
      )}
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#132630]/84 via-[#162b36]/76 to-[#0f1f28]/92"
        aria-hidden="true"
      />

      <div className="relative z-10 my-auto grid w-full max-w-lg place-items-center">
        {/* Tahap 1: Amplop Tertutup -> Terbuka & Kertas Mulai Keluar */}
        <div
          aria-hidden={isCardVisible}
          className={`[grid-area:1/1] envelope-scene w-full max-w-[440px] transition-all duration-500 ease-out ${
            isCardVisible
              ? 'pointer-events-none translate-y-20 scale-95 opacity-0'
              : 'translate-y-0 scale-100 opacity-100'
          }`}
        >
          <div className="mb-5 text-center">
            <p className="text-[11px] tracking-[0.24em] uppercase text-[#e7c6ca] font-semibold mb-1.5">
              Undangan Pernikahan
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#f7f9fb] tracking-tight">
              Fadhil <span className="italic font-normal text-[#e7c6ca]">&amp;</span> Indhea
            </h1>
          </div>

          <div className="relative mx-auto w-full pt-8 sm:pt-10">
            {/* Badan Amplop */}
            <div className="relative h-[245px] sm:h-[275px] w-full rounded-xl shadow-[0_24px_60px_-15px_rgba(6,15,20,0.8)]">
              {/* Lapisan Dalam Amplop */}
              <div className="absolute inset-0 rounded-xl border border-[#e7c6ca]/25 bg-[#12242e]" />

              {/* Kertas Undangan yang Keluar dari Dalam Amplop */}
              <div
                className={`absolute inset-x-4 sm:inset-x-5 top-3 bottom-4 z-10 rounded-lg border border-[#1f3b4a]/15 bg-[#f7f9fb] px-5 py-5 text-center text-[#162b36] shadow-lg transition-all duration-600 ease-out ${
                  isPaperRising
                    ? '-translate-y-24 sm:-translate-y-28 opacity-100 shadow-2xl'
                    : 'translate-y-3 opacity-0'
                }`}
              >
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#a85d66] font-semibold mb-1">
                  Undangan Pernikahan
                </p>
                <p className="font-editorial text-2xl sm:text-3xl font-semibold text-[#162b36]">
                  Fadhil <span className="italic font-normal text-[#a85d66]">&amp;</span> Indhea
                </p>
                <p className="text-[11px] text-[#4e6775] mt-1">
                  {WEDDING_DATE_DISPLAY}
                </p>
                <div className="mx-auto my-2.5 h-px w-16 bg-[#a85d66]/35" />
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#4e6775]">
                  Kepada Yth. {guestName}
                </p>
              </div>

              {/* Kantong Depan Amplop (Lipatan Kiri, Kanan, Bawah) */}
              <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl border border-[#e7c6ca]/25">
                <svg
                  viewBox="0 0 400 260"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  aria-hidden="true"
                >
                  {/* Sayap Kiri */}
                  <polygon
                    points="0,0 205,138 0,260"
                    fill="#1b3442"
                    stroke="rgba(231, 198, 202, 0.16)"
                    strokeWidth="1"
                  />
                  {/* Sayap Kanan */}
                  <polygon
                    points="400,0 195,138 400,260"
                    fill="#19303d"
                    stroke="rgba(231, 198, 202, 0.16)"
                    strokeWidth="1"
                  />
                  {/* Lipatan Bawah */}
                  <path
                    d="M 0 260 L 186 128 Q 200 118 214 128 L 400 260 Z"
                    fill="#213f4f"
                    stroke="rgba(231, 198, 202, 0.28)"
                    strokeWidth="1.2"
                  />
                </svg>

                {/* Label Penerima pada Bagian Depan Amplop */}
                <div className="absolute inset-x-6 bottom-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#b8ccd6] mb-0.5">
                    Kepada Yth.
                  </p>
                  <p className="font-editorial text-xl sm:text-2xl font-semibold text-[#f7f9fb] truncate">
                    {guestName}
                  </p>
                </div>
              </div>

              {/* Tutup Amplop 3D Atas + Segel Lilin */}
              <div
                className={`envelope-flap absolute inset-x-0 top-0 h-[155px] sm:h-[172px] ${
                  isPaperRising ? 'z-0' : 'z-30'
                } ${isFlapOpen ? 'envelope-flap-open' : ''}`}
              >
                {/* Sisi Depan Tutup Amplop */}
                <div className="envelope-face absolute inset-0">
                  <svg
                    viewBox="0 0 400 172"
                    preserveAspectRatio="none"
                    className="h-full w-full drop-shadow-md"
                    aria-hidden="true"
                  >
                    <path
                      d="M 0 12 Q 0 0 12 0 L 388 0 Q 400 0 400 12 L 210 150 Q 200 158 190 150 Z"
                      fill="#234354"
                      stroke="rgba(231, 198, 202, 0.36)"
                      strokeWidth="1.3"
                    />
                  </svg>

                  {/* Segel Lilin Dusty Rose */}
                  <button
                    type="button"
                    onClick={handleOpenEnvelope}
                    disabled={stage !== 'sealed'}
                    tabIndex={isCardVisible ? -1 : 0}
                    aria-label="Buka amplop undangan"
                    className={`group absolute left-1/2 bottom-2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#e7c6ca]/80 bg-[#a85d66] text-[#f7f9fb] shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-[#924d56] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7c6ca] ${
                      isFlapOpen ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                    }`}
                  >
                    <span className="pointer-events-none flex h-11 w-11 items-center justify-center rounded-full border border-[#f7f9fb]/35 font-editorial text-lg font-semibold tracking-wider">
                      F&amp;I
                    </span>
                  </button>
                </div>

                {/* Sisi Dalam Tutup Amplop Saat Terbuka */}
                <div className="envelope-face-back absolute inset-0" aria-hidden="true">
                  <svg
                    viewBox="0 0 400 172"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    <path
                      d="M 0 12 Q 0 0 12 0 L 388 0 Q 400 0 400 12 L 210 150 Q 200 158 190 150 Z"
                      fill="#172e3a"
                      stroke="rgba(231, 198, 202, 0.25)"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 text-center">
            <button
              type="button"
              onClick={handleOpenEnvelope}
              disabled={stage !== 'sealed'}
              tabIndex={isCardVisible ? -1 : 0}
              className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg bg-[#a85d66] hover:bg-[#924d56] active:scale-[0.98] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7c6ca] whitespace-nowrap cursor-pointer disabled:opacity-75"
            >
              <MailOpen className="h-4 w-4 shrink-0" />
              <span>Buka Amplop</span>
            </button>
            <p className="mt-2.5 text-xs text-[#b8ccd6]">
              Ketuk segel atau tombol untuk membuka surat undangan
            </p>
          </div>
        </div>

        {/* Tahap 2: Kertas Undangan Pernikahan Muncul Penuh & Siap Masuk Halaman Utama */}
        <div
          aria-hidden={!isCardVisible}
          className={`[grid-area:1/1] w-full flex justify-center transition-all duration-500 ease-out ${
            isEnteringMain
              ? 'pointer-events-none -translate-y-6 scale-[1.02] opacity-0'
              : isCardVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none translate-y-12 scale-90 opacity-0'
          }`}
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-[#1f3b4a]/15 bg-[#f7f9fb] text-[#162b36] px-6 py-10 sm:px-10 sm:py-12 text-center shadow-2xl">
            <BotanicalCorner position="top-left" variant="dark" />
            <BotanicalCorner position="top-right" variant="dark" />
            <BotanicalCorner position="bottom-left" variant="dark" />
            <BotanicalCorner position="bottom-right" variant="dark" />

            <p className="text-xs tracking-[0.22em] uppercase text-[#a85d66] mb-3 font-semibold">
              Undangan Pernikahan
            </p>

            <h2 className="font-editorial text-4xl sm:text-6xl font-semibold tracking-tight text-[#162b36] text-balance leading-[1.08] mb-2.5">
              Fadhil <span className="italic font-normal text-[#a85d66]">&amp;</span> Indhea
            </h2>

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
              onClick={handleEnterInvitation}
              disabled={stage !== 'card-revealed'}
              tabIndex={isCardVisible ? 0 : -1}
              className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg bg-[#a85d66] hover:bg-[#924d56] active:scale-[0.98] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3b4a] whitespace-nowrap cursor-pointer disabled:opacity-80"
            >
              <span>Buka Undangan</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplashScreen;