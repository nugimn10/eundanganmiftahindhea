import React, { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import {
  IMAGES,
  WEDDING_DATE_DISPLAY,
  WEDDING_DATE_ISO,
  downloadWeddingIcs,
} from '../data/weddingData';
import { BotanicalDivider } from './BotanicalOrnament';

const CountdownBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-[#f7f9fb]/20 bg-[#0f1f28]/55 backdrop-blur-sm py-4 px-3 sm:py-6 sm:px-5">
    <span className="font-editorial text-3xl sm:text-5xl font-semibold text-[#f7f9fb] tabular-nums leading-none mb-1.5">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-xs uppercase tracking-[0.16em] text-[#e7c6ca] font-medium">
      {label}
    </span>
  </div>
);

const Countdown: React.FC = () => {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE_ISO);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      id="hitung-mundur"
      aria-label="Hitung Mundur Pernikahan"
      className="relative overflow-hidden bg-[#162b36] py-16 sm:py-24 px-4 sm:px-6 text-center text-[#f7f9fb]"
    >
      {!imgFailed && (
        <img
          src={IMAGES.cover}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#162b36]/85 via-[#162b36]/75 to-[#162b36]/90"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[#e7c6ca] font-semibold mb-3">
          Menghitung Hari
        </p>
        <h2 className="font-editorial text-3xl sm:text-5xl font-semibold text-[#f7f9fb] mb-3 text-balance">
          Menuju Hari Bahagia Kami
        </h2>
        <p className="text-sm sm:text-base text-[#d5e1e8] mb-8">{WEDDING_DATE_DISPLAY}</p>

        <BotanicalDivider variant="light" className="mb-10" />

        <div className="grid grid-cols-4 gap-2.5 sm:gap-5 max-w-xl mx-auto mb-10">
          <CountdownBox value={days} label="Hari" />
          <CountdownBox value={hours} label="Jam" />
          <CountdownBox value={minutes} label="Menit" />
          <CountdownBox value={seconds} label="Detik" />
        </div>

        <button
          type="button"
          onClick={downloadWeddingIcs}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#e7c6ca]/45 bg-[#a85d66] hover:bg-[#924d56] px-6 py-3 text-sm font-semibold text-white transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7c6ca]"
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Tambahkan ke Kalender</span>
        </button>
      </div>
    </section>
  );
};

export default Countdown;