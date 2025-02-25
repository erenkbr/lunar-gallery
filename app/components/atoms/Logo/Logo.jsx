"use client";

import Image from 'next/image';
import Link from 'next/link';
import styles from './Logo.module.css';

export function Logo({
  showText = true,
  size = 'medium', // small, medium, large
  asLink = true,
  className = '',
  ...props
}) {
  // Size mapping for logo image in pixels
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80
  };
  
  const pixelSize = sizeMap[size] || sizeMap.medium;
  
  const LogoContent = (
    <div className={`${styles.logo} ${styles[size]} ${className}`} {...props}>
      <Image 
        src="/moon-logo.svg" 
        alt="Lunar Gallery" 
        width={pixelSize}
        height={pixelSize}
        className={styles.image}
      />
      {showText && (
        <span className={styles.text}>lunar.gallery</span>
      )}
    </div>
  );
  
  if (asLink) {
    return (
      <Link href="/" className={styles.link}>
        {LogoContent}
      </Link>
    );
  }
  
  return LogoContent;
}