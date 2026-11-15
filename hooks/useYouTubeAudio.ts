import { useCallback, useEffect, useRef, useState } from 'react';

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  destroy: () => void;
}

interface YTEvent {
  data: number;
  target: YTPlayer;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: YTEvent) => void;
            onStateChange?: (event: YTEvent) => void;
            onError?: (event: YTEvent) => void;
          };
        }
      ) => YTPlayer;
      PlayerState?: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface UseYouTubeAudioOptions {
  containerId: string;
  primaryId: string;
  fallbackId?: string;
}

export function useYouTubeAudio({
  containerId,
  primaryId,
  fallbackId,
}: UseYouTubeAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const isReadyRef = useRef(false);
  const desiredPlayingRef = useRef(false);
  const triedFallbackRef = useRef(false);

  useEffect(() => {
    let destroyed = false;

    const initPlayer = () => {
      if (destroyed || !window.YT?.Player) return;
      const el = document.getElementById(containerId);
      if (!el || playerRef.current) return;

      playerRef.current = new window.YT.Player(containerId, {
        videoId: primaryId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          loop: 1,
          playlist: primaryId,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (destroyed) return;
            isReadyRef.current = true;
            if (desiredPlayingRef.current) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            if (destroyed) return;
            const playingState = window.YT?.PlayerState?.PLAYING ?? 1;
            const pausedState = window.YT?.PlayerState?.PAUSED ?? 2;
            const endedState = window.YT?.PlayerState?.ENDED ?? 0;

            if (event.data === playingState) {
              setIsPlaying(true);
            } else if (event.data === pausedState) {
              setIsPlaying(false);
            } else if (event.data === endedState && desiredPlayingRef.current) {
              event.target.playVideo();
            }
          },
          onError: (event) => {
            if (destroyed) return;
            if (fallbackId && !triedFallbackRef.current) {
              triedFallbackRef.current = true;
              if (desiredPlayingRef.current) {
                event.target.loadVideoById(fallbackId);
              } else {
                event.target.cueVideoById(fallbackId);
              }
            } else {
              desiredPlayingRef.current = false;
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        initPlayer();
      };

      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
    }

    return () => {
      destroyed = true;
      isReadyRef.current = false;
      try {
        playerRef.current?.destroy();
      } catch {
        // Ignore cleanup errors
      }
      playerRef.current = null;
    };
  }, [containerId, primaryId, fallbackId]);

  const play = useCallback(() => {
    desiredPlayingRef.current = true;
    setIsPlaying(true);
    if (isReadyRef.current && playerRef.current) {
      try {
        playerRef.current.playVideo();
      } catch {
        setIsPlaying(false);
      }
    }
  }, []);

  const pause = useCallback(() => {
    desiredPlayingRef.current = false;
    setIsPlaying(false);
    if (isReadyRef.current && playerRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch {
        // Ignore pause errors
      }
    }
  }, []);

  const toggle = useCallback(() => {
    if (desiredPlayingRef.current) {
      pause();
    } else {
      play();
    }
  }, [pause, play]);

  return { isPlaying, play, pause, toggle };
}
