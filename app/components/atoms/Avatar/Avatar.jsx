// app/components/atoms/Avatar/Avatar.jsx
"use client";

import Image from 'next/image';
import styles from './Avatar.module.css';

export function Avatar({
  src,
  alt,
  size = 'medium', // small, medium, large
  isSelected = false,
  className = '',
  onClick,
  ...props
}) {
  // Size mapping in pixels
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64
  };
  
  const pixelSize = sizeMap[size] || sizeMap.medium;

  return (
    <div 
      className={`
        ${styles.avatar}
        ${styles[size]}
        ${isSelected ? styles.selected : ''}
        ${onClick ? styles.clickable : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      <img
        src={src}
        alt={alt || "Avatar"}
        width={pixelSize}
        height={pixelSize}
        className={styles.image}
      />
    </div>
  );
}