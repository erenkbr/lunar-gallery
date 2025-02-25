"use client";
import { Avatar } from '@/app/components/atoms/Avatar/Avatar';
import { Text } from '@/app/components/atoms/Text/Text';
import { Skeleton } from '@/app/components/atoms/Skeleton/Skeleton';
import styles from './Card.module.css';

export function Card({ imageSrc, title, isLoading = false }) {
  return (
    <div className={styles.card}>
      {isLoading ? (
        <Skeleton variant="rect" width="100%" height="150px" />
      ) : (
        <img src={imageSrc} alt={title} className={styles.image} />
      )}
      <Text variant="body" weight="medium" className={styles.title}>
        {isLoading ? <Skeleton variant="text" width="80%" /> : title}
      </Text>
    </div>
  );
}