import React from 'react';
import { Calendar, Heart, Home, Image as ImageIcon, MailCheck } from 'lucide-react';

interface NavbarProps {
  onShowCover: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onShowCover }) => {
  return (
    <>
      <header className="sticky top-0 z-30 hidden md:block border-b border-[#1f3b4a]/10 bg-[#f7f9fb]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#hero"
            className="font-editorial text-2xl font-semibold tracking-tight text-[#162b36] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a85d66]"
          >
            Fadhil &amp; Indhea
          </a>

          <nav aria-label="Navigasi Undangan" className="flex items-center gap-7 text-sm font-medium text-[#4e6775]">
            <a
              href="#mempelai"
              className="hover:text-[#162b36] hover:underline underline-offset-4 decoration-[#a85d66] transition-colors whitespace-nowrap shrink-0"
            >
              Mempelai
            </a>
            <a
              href="#acara"
              className="hover:text-[#162b36] hover:underline underline-offset-4 decoration-[#a85d66] transition-colors whitespace-nowrap shrink-0"
            >
              Acara
            </a>
            <a
              href="#kisah"
              className="hover:text-[#162b36] hover:underline underline-offset-4 decoration-[#a85d66] transition-colors whitespace-nowrap shrink-0"
            >
              Kisah
            </a>
            <a
              href="#galeri"
              className="hover:text-[#162b36] hover:underline underline-offset-4 decoration-[#a85d66] transition-colors whitespace-nowrap shrink-0"
            >
              Galeri
            </a>
            <a
              href="#hadiah"
              className="hover:text-[#162b36] hover:underline underline-offset-4 decoration-[#a85d66] transition-colors whitespace-nowrap shrink-0"
            >
              Kado
            </a>
          </nav>

          <div className="shrink-0">
            <a
              href="#ucapan"
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#1f3b4a] hover:bg-[#162b36] px-4 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a85d66]"
            >
              Ucapan &amp; Kehadiran
            </a>
          </div>
        </div>
      </header>

      <nav
        aria-label="Navigasi Mobile"
        className="fixed bottom-0 inset-x-0 z-30 flex md:hidden h-14 items-center justify-around border-t border-[#1f3b4a]/12 bg-[#f7f9fb]/95 backdrop-blur-md px-2"
      >
        <button
          type="button"
          onClick={onShowCover}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] min-h-[44px] text-[#4e6775] hover:text-[#162b36] transition-colors cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span className="text-[11px] font-medium whitespace-nowrap">Sampul</span>
        </button>
        <a
          href="#mempelai"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] min-h-[44px] text-[#4e6775] hover:text-[#162b36] transition-colors"
        >
          <Heart className="h-4 w-4" />
          <span className="text-[11px] font-medium whitespace-nowrap">Mempelai</span>
        </a>
        <a
          href="#acara"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] min-h-[44px] text-[#4e6775] hover:text-[#162b36] transition-colors"
        >
          <Calendar className="h-4 w-4" />
          <span className="text-[11px] font-medium whitespace-nowrap">Acara</span>
        </a>
        <a
          href="#galeri"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] min-h-[44px] text-[#4e6775] hover:text-[#162b36] transition-colors"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="text-[11px] font-medium whitespace-nowrap">Galeri</span>
        </a>
        <a
          href="#ucapan"
          className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] min-h-[44px] text-[#a85d66] hover:text-[#924d56] transition-colors"
        >
          <MailCheck className="h-4 w-4" />
          <span className="text-[11px] font-semibold whitespace-nowrap">Ucapan</span>
        </a>
      </nav>
    </>
  );
};

export default Navbar;
