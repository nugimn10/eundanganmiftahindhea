import React, { useState } from 'react';
import { Check, Copy, Gift } from 'lucide-react';
import { GIFT_ADDRESS } from '../data/weddingData';
import { BotanicalDivider } from './BotanicalOrnament';

const GiftSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(GIFT_ADDRESS.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <section id="hadiah" className="bg-[#edf2f6] py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-3">
            Tanda Kasih
          </p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#162b36] mb-4 text-balance">
            Kirim Kado Pernikahan
          </h2>
          <p className="text-sm sm:text-base text-[#4e6775] leading-relaxed">
            Doa restu dan kehadiran Anda di hari bahagia kami merupakan karunia terindah. Apabila
            Anda berkeinginan mengirimkan kado fisik, silakan kirimkan melalui alamat berikut.
          </p>
          <BotanicalDivider className="mt-6" />
        </div>

        <article className="mx-auto max-w-xl rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 sm:p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#faf5f6] text-[#a85d66] border border-[#a85d66]/20">
            <Gift className="h-5 w-5" />
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#a85d66] font-semibold mb-2">
            Alamat Pengiriman Kado
          </p>
          <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#162b36] mb-2">
            {GIFT_ADDRESS.recipient}
          </h3>
          <p className="text-sm text-[#4e6775] mb-1 tabular-nums">{GIFT_ADDRESS.phone}</p>
          <p className="text-sm sm:text-base text-[#2b3d47] leading-relaxed mb-6">
            {GIFT_ADDRESS.address}
          </p>

          <button
            type="button"
            onClick={handleCopyAddress}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              copied
                ? 'bg-[#2d6a4f] text-white'
                : 'bg-[#1f3b4a] hover:bg-[#162b36] text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Alamat Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Salin Alamat Lengkap</span>
              </>
            )}
          </button>
        </article>
      </div>
    </section>
  );
};

export default GiftSection;