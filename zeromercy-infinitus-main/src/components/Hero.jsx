import React from 'react';
import HeroBackground from './HeroBackground';
import styles from './Hero.module.css';

export default function Hero({ title = 'TECHFEST • INNOVATE', subtitle = 'A festival of ideas • Minimal • Futuristic', cta = 'Register Now' }) {
  return (
    <section className={styles.heroSection}>
      <HeroBackground accent={[0.05, 0.7, 1.0]} />

      <div className={styles.overlay}>
        <div className={styles.inner}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.ctaRow}>
            <button className={styles.cta}>{cta}</button>
            <button className={styles.secondary} aria-hidden>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
