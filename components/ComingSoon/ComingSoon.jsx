import styles from './ComingSoon.module.css';
import Image from 'next/image';

export default function ComingSoon() {
  return (
    <main className={styles.container}>
      <div className={styles.branding}>
        <Image 
          src="/moon-logo.svg" 
          alt="Lunar Gallery Logo" 
          width={500} 
          height={500} 
          className={styles.logo}
        />
        <h1 className={styles.heading}>lunar.gallery</h1>
      </div>
      <p className={styles.tagline}>see more. own more.</p>
      <h1 className={styles.message}>coming soon.</h1>
    </main>
  );
}
