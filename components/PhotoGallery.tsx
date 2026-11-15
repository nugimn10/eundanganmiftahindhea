import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/weddingData';
import { useParallax } from '../hooks/useParallax';
import { BotanicalDivider } from './BotanicalOrnament';

const PhotoGallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});
  const { containerRef: leadContainerRef, layerRef: leadLayerRef } = useParallax<HTMLImageElement>({
    speed: 0.08,
    maxOffset: 22,
  });

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex]);

  const activePhoto = selectedIndex !== null ? GALLERY_PHOTOS[selectedIndex] : null;

  return (
    <section id="galeri" className="bg-[#edf2f6] py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-3">
            Galeri Foto
          </p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#162b36] mb-4 text-balance">
            Momen Abadi Kami
          </h2>
          <p className="text-sm sm:text-base text-[#4e6775] leading-relaxed">
            Potret hangat perjalanan kami dalam balutan nuansa pesisir dan bunga mawar. Klik foto
            untuk melihat tampilan penuh.
          </p>
          <BotanicalDivider className="mt-6" />
        </div>

        <div ref={leadContainerRef} className="scroll-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {GALLERY_PHOTOS.map((photo, index) => {
            const isLead = photo.span === 'lead';
            const isFailed = failedIds[photo.id];
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`group relative overflow-hidden rounded-2xl border border-[#1f3b4a]/12 bg-white text-left shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a85d66] ${
                  isLead ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto lg:min-h-[440px]' : 'aspect-[4/3]'
                }`}
              >
                {!isFailed ? (
                  <img
                    ref={isLead ? leadLayerRef : undefined}
                    src={photo.src}
                    alt={photo.alt}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedIds((prev) => ({ ...prev, [photo.id]: true }))
                    }
                    className={`object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
                      isLead ? 'parallax-layer h-[110%] -mt-[5%] w-full' : 'h-full w-full'
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-[#1f3b4a] p-6 text-center text-[#f7f9fb]">
                    <span className="font-editorial text-2xl text-[#e7c6ca]">
                      {photo.caption}
                    </span>
                    <span className="text-xs text-[#d5e1e8] mt-1">{photo.location}</span>
                  </div>
                )}

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#162b36]/80 via-[#162b36]/15 to-transparent opacity-85 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="font-editorial text-xl sm:text-2xl font-medium text-[#f7f9fb] leading-snug">
                    {photo.caption}
                  </p>
                  <p className="text-xs text-[#d5e1e8] mt-0.5">{photo.location}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activePhoto && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.caption}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f28]/92 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-3 text-[#f7f9fb]">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-medium">
                  {activePhoto.caption}
                </h3>
                <p className="text-xs sm:text-sm text-[#d5e1e8]">
                  {activePhoto.location} <span aria-hidden="true">·</span>{' '}
                  <span className="tabular-nums">
                    {selectedIndex + 1} / {GALLERY_PHOTOS.length}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Tutup pratinjau foto"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#f7f9fb]/25 bg-[#162b36] text-white hover:bg-[#a85d66] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#f7f9fb]/15 bg-[#162b36]">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-full object-contain mx-auto"
              />

              <button
                type="button"
                onClick={() =>
                  setSelectedIndex(
                    (selectedIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
                  )
                }
                aria-label="Foto sebelumnya"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-[#162b36]/80 text-white hover:bg-[#a85d66] border border-[#f7f9fb]/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((selectedIndex + 1) % GALLERY_PHOTOS.length)
                }
                aria-label="Foto berikutnya"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-[#162b36]/80 text-white hover:bg-[#a85d66] border border-[#f7f9fb]/20 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;