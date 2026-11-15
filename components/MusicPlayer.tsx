import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { YOUTUBE_MUSIC } from '../data/weddingData';

interface MusicPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, togglePlay }) => {
  const trackLabel = `${YOUTUBE_MUSIC.title} – ${YOUTUBE_MUSIC.artist}`;

  return (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={isPlaying ? `Jeda musik ${trackLabel}` : `Putar musik ${trackLabel}`}
      title={`${isPlaying ? 'Jeda' : 'Putar'}: ${trackLabel} (YouTube)`}
      className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#f7f9fb]/25 bg-[#162b36]/90 text-[#f7f9fb] shadow-lg hover:bg-[#a85d66] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a85d66]"
    >
      {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </button>
  );
};

export default MusicPlayer;