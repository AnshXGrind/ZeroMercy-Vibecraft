import React from 'react';
import VideoBackground from './VideoBackground';
import styles from './HeroVideo.module.css';

export default function HeroVideo({
  videoSrc = '/videos/srm1.mp4',
  posterSrc = null,
  title = 'TECHFEST • INNOVATE',
  subtitle = 'A festival of ideas • Premium Experience',
  cta = 'Register Now'
}) {
  return (
    <section className={styles.heroSection}>
      <VideoBackground src={videoSrc} poster={posterSrc} muted loop autoplay>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.ctaRow}>
            <button className={styles.cta}>{cta}</button>
            <button className={styles.secondary}>Learn More</button>
          </div>
        </div>
      </VideoBackground>
    </section>
  );
}
