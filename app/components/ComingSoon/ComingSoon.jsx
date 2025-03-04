"use client";
import TwitterWaitlist from '../organisms/TwitterWaitlist/TwitterWaitlist';
import styles from './ComingSoon.module.css';
import Image from 'next/image';

export default function ComingSoon() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.branding}>
          <Image
            src="/moon-logo.svg"
            alt="Lunar Gallery Logo"
            width={120}
            height={120}
            className={styles.logo}
          />
          <h1 className={styles.heading}>lunar.gallery</h1>
        </div>
        <h2 className={styles.message}>a space for objekt collectors. coming soon.</h2>
        <div className={styles.waitlistContainer}>
          <TwitterWaitlist />
        </div>
      </div>
    </main>
  );
}