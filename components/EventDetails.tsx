import React from 'react';
import { Calendar, Clock, ExternalLink, MapPin } from 'lucide-react';
import { UNIFIED_EVENT } from '../data/weddingData';
import { BotanicalDivider } from './BotanicalOrnament';

const EventDetails: React.FC = () => {
  return (
    <section id="acara" className="bg-[#f7f9fb] py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-3">
            Rangkaian Acara
          </p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#162b36] mb-4 text-balance">
            Akad Nikah &amp; Resepsi
          </h2>
          <p className="text-sm sm:text-base text-[#4e6775] leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            berkenan hadir untuk memberikan doa restu pada rangkaian acara kami di satu lokasi yang
            sama.
          </p>
          <BotanicalDivider className="mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          <article className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 sm:p-8 shadow-sm">
            <div>
              <div className="border-b border-[#1f3b4a]/10 pb-5 mb-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[#a85d66] font-semibold mb-1.5">
                  Lokasi &amp; Jadwal Terpadu
                </p>
                <h3 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#162b36]">
                  {UNIFIED_EVENT.venue}
                </h3>
              </div>

              <div className="space-y-4 text-sm text-[#2b3d47] mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-[#a85d66] shrink-0 mt-0.5" />
                  <span className="font-semibold text-[#162b36]">{UNIFIED_EVENT.date}</span>
                </div>

                <div className="rounded-xl border border-[#1f3b4a]/10 bg-[#f7f9fb] p-4 space-y-3">
                  {UNIFIED_EVENT.schedules.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 border-b last:border-b-0 border-[#1f3b4a]/8 pb-2.5 last:pb-0"
                    >
                      <span className="font-medium text-[#162b36]">{item.label}</span>
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#a85d66] tabular-nums whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#a85d66] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{UNIFIED_EVENT.address}</span>
                </div>

                <p className="pt-3 text-xs text-[#4e6775] leading-relaxed border-t border-[#1f3b4a]/10">
                  {UNIFIED_EVENT.note}
                </p>
              </div>
            </div>

            <a
              href={UNIFIED_EVENT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-[#1f3b4a] hover:bg-[#162b36] text-white px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a85d66]"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Buka di Google Maps</span>
            </a>
          </article>

          <div className="lg:col-span-7 flex flex-col rounded-2xl border border-[#1f3b4a]/12 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 px-1">
              <h3 className="font-editorial text-2xl font-semibold text-[#162b36]">
                Peta Lokasi Acara
              </h3>
              <p className="text-xs text-[#4e6775]">
                {UNIFIED_EVENT.venue} · Rangkasbitung
              </p>
            </div>

            <div className="flex-1 min-h-[340px] sm:min-h-[400px] overflow-hidden rounded-xl border border-[#1f3b4a]/10 bg-[#edf2f6]">
              <iframe
                src={UNIFIED_EVENT.mapEmbedUrl}
                width="100%"
                height="100%"
                className="min-h-[340px] sm:min-h-[400px] h-full w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Peta lokasi ${UNIFIED_EVENT.venue}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;