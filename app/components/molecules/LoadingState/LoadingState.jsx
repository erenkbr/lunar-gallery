"use client";
import { Skeleton } from '@/app/components/atoms/Skeleton/Skeleton';
import styles from './LoadingState.module.css';

export function LoadingState({ count = 8 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.card}>
          <Skeleton variant="rect" width="100%" height="150px" />
          <Skeleton variant="text" width="80%" />
        </div>
      ))}
    </div>
  );
}