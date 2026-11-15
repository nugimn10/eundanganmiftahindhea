import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CoupleSection from './components/CoupleSection';
import Countdown from './components/Countdown';
import EventDetails from './components/EventDetails';
import LoveStory from './components/LoveStory';
import PhotoGallery from './components/PhotoGallery';
import CommentSection from './components/CommentSection';
import GiftSection from './components/GiftSection';
import MusicPlayer from './components/MusicPlayer';
import AdminGuestPage from './components/AdminGuestPage';
import { BotanicalDivider } from './components/BotanicalOrnament';
import {
  WEDDING_CITY,
  WEDDING_DATE_DISPLAY,
  YOUTUBE_MUSIC,
} from './data/weddingData';
import { useYouTubeAudio } from './hooks/useYouTubeAudio';

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  return hash === '#admin' || hash.startsWith('#admin/') || params.get('page') === 'admin';
}

const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);
  const [isInvitationOpen, setInvitationOpen] = useState(false);

  useEffect(() => {
    const syncRoute = () => setIsAdminRoute(checkIsAdminRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const handleExitAdmin = () => {
    if (window.location.hash.toLowerCase().startsWith('#admin')) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`
      );
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      window.history.replaceState(null, '', url.toString());
    }
    setIsAdminRoute(false);
  };

  if (isAdminRoute) {
    return <AdminGuestPage onExitAdmin={handleExitAdmin} />;
  }

  return (
    <InvitationView
      isInvitationOpen={isInvitationOpen}
      setInvitationOpen={setInvitationOpen}
    />
  );
};

interface InvitationViewProps {
  isInvitationOpen: boolean;
  setInvitationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InvitationView: React.FC<InvitationViewProps> = ({
  isInvitationOpen,
  setInvitationOpen,
}) => {
  const {
    isPlaying: isMusicPlaying,
    play: playMusic,
    toggle: toggleMusic,
  } = useYouTubeAudio({
    containerId: 'yt-wedding-music',
    primaryId: YOUTUBE_MUSIC.primaryId,
    fallbackId: YOUTUBE_MUSIC.fallbackId,
  });

  const guestName = useMemo(() => {
    if (typeof window === 'undefined') return 'Tamu Undangan Terhormat';
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to')?.trim();
    return to && to.length > 0 ? to : 'Tamu Undangan Terhormat';
  }, []);

  useEffect(() => {
    if (!isInvitationOpen) return;

    const elements = document.querySelectorAll('.scroll-animate');
    if (elements.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isInvitationOpen]);

  const handleOpenInvitation = () => {
    setInvitationOpen(true);
    playMusic();
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleShowCover = () => {
    setInvitationOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#1f3b4a]">
      {!isInvitationOpen && (
        <SplashScreen
          guestName={guestName}
          onStartOpening={playMusic}
          onOpen={handleOpenInvitation}
        />
      )}

      {isInvitationOpen && (
        <div className="pb-14 md:pb-0">
          <Navbar onShowCover={handleShowCover} />

          <main>
            <HeroSection />

            <div className="scroll-animate">
              <CoupleSection />
            </div>

            <div className="scroll-animate">
              <Countdown />
            </div>

            <div className="scroll-animate">
              <EventDetails />
            </div>

            <div className="scroll-animate">
              <LoveStory />
            </div>

            <div className="scroll-animate">
              <PhotoGallery />
            </div>

            <div className="scroll-animate">
              <CommentSection defaultGuestName={guestName} />
            </div>

            <div className="scroll-animate">
              <GiftSection />
            </div>
          </main>

          <footer className="bg-[#162b36] text-[#f7f9fb] py-14 sm:py-16 px-4 sm:px-6 text-center">
            <div className="mx-auto max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#e7c6ca] font-semibold mb-3">
                Terima Kasih
              </p>
              <h2 className="font-editorial text-4xl sm:text-5xl font-semibold mb-4">
                Fadhil <span className="italic font-normal text-[#e7c6ca]">&amp;</span> Indhea
              </h2>
              <p className="text-sm text-[#d5e1e8] leading-relaxed mb-6">
                Merupakan kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
                Kami yang berbahagia, Keluarga Besar Bapak Asep &amp; Bapak Agus (nanti kirimin di wa nama ayah ibu fadhil sama indhea dil).
              </p>

              <BotanicalDivider variant="light" className="mb-6" />

              <p className="text-xs text-[#b8ccd6] mb-6">
                {WEDDING_DATE_DISPLAY} <span aria-hidden="true">·</span> {WEDDING_CITY}
              </p>

              <button
                type="button"
                onClick={handleShowCover}
                className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-[#f7f9fb]/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-medium text-[#f7f9fb] transition-colors cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                <span>Kembali ke Sampul</span>
              </button>
            </div>
          </footer>

          <MusicPlayer isPlaying={isMusicPlaying} togglePlay={toggleMusic} />
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[200px] w-[200px] overflow-hidden opacity-[0.001]"
      >
        <div id="yt-wedding-music" className="h-full w-full" />
      </div>
    </div>
  );
};

export default App;