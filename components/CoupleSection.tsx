import React, { useState } from 'react';
import { COUPLE } from '../data/weddingData';
import { BotanicalDivider } from './BotanicalOrnament';

const PersonCard: React.FC<{
  person: typeof COUPLE.groom;
}> = ({ person }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="flex flex-col items-center text-center rounded-2xl border border-[#1f3b4a]/12 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 w-52 sm:w-60 aspect-[3/4] rounded-t-full rounded-b-xl border border-[#a85d66]/30 bg-[#edf2f6] p-2">
        <div className="h-full w-full overflow-hidden rounded-t-full rounded-b-lg bg-[#1f3b4a]/10">
          {!imgFailed ? (
            <img
              src={person.image}
              alt={`${person.role} - ${person.fullName}`}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1f3b4a] text-[#f7f9fb] font-editorial text-3xl">
              {person.shortName}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.18em] text-[#a85d66] font-semibold mb-2">
        {person.role}
      </p>
      <h3 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#162b36] mb-2 text-balance">
        {person.fullName}
      </h3>
      <p className="text-sm font-medium text-[#1f3b4a] mb-3 max-w-sm">{person.parents}</p>
      <p className="text-sm text-[#4e6775] leading-relaxed max-w-sm mb-4">{person.bio}</p>
      <p className="text-xs text-[#4e6775] mt-auto pt-3 border-t border-[#1f3b4a]/10 w-full max-w-xs">
        Asal {person.origin}
      </p>
    </article>
  );
};

const CoupleSection: React.FC = () => {
  return (
    <section id="mempelai" className="bg-[#edf2f6] py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#a85d66] font-semibold mb-3">
            Bismillahirrahmanirrahim
          </p>
          <h2 className="font-editorial text-4xl sm:text-5xl font-semibold text-[#162b36] mb-4 text-balance">
            Mempelai yang Berbahagia
          </h2>
          <p className="text-sm sm:text-base text-[#4e6775] leading-relaxed">
            Dengan memohon rahmat serta rida Allah SWT, kami bermaksud menyelenggarakan pernikahan
            putra-putri kami:
          </p>
          <BotanicalDivider className="mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-stretch">
          <div className="md:col-span-5 flex">
            <div className="w-full flex">
              <div className="w-full">
                <PersonCard person={COUPLE.groom} />
              </div>
            </div>
          </div>

          <div className="md:col-span-1 flex items-center justify-center py-2">
            <span
              className="font-editorial italic text-5xl sm:text-6xl text-[#a85d66] select-none"
              aria-hidden="true"
            >
              &amp;
            </span>
          </div>

          <div className="md:col-span-5 flex">
            <div className="w-full">
              <PersonCard person={COUPLE.bride} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
