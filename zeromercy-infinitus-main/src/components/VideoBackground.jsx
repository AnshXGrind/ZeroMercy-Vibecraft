import React, { useRef, useEffect } from 'react';
import styles from './VideoBackground.module.css';

/**
 * VideoBackground component — plays a video as a full-screen background
 * Optimized for web with automatic quality adjustment and autoplay fallback
 * 
 * Props:
 *   - src: video file path (e.g., '/videos/srm1.mp4')
 *   - poster: static image fallback (optional)
 *   - muted: mute audio (default: true)
 *   - loop: loop video (default: true)
 *   - autoplay: autoplay on load (default: true)
 *   - objectFit: CSS object-fit (default: 'cover')
 */
export default function VideoBackground({
  src,
  poster = null,
  muted = true,
  loop = true,
  autoplay = true,
  objectFit = 'cover',
  children = null
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to always play
    const ensurePlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry on visibility change
          setTimeout(() => video.play(), 100);
        });
      }
    };

    ensurePlay();

    // Resume on visibility change or user interaction
    const handleVisibility = () => {
      if (!video.paused) return;
      ensurePlay();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [autoplay]);

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        className={styles.video}
        poster={poster}
        muted={muted}
        loop={loop}
        autoPlay={autoplay}
        playsInline
        style={{ objectFit }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {children && <div className={styles.overlay}>{children}</div>}
    </div>
  );
}
