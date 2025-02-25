"use client";
import { Avatar } from '@/app/components/atoms/Avatar/Avatar';
import { Text } from '@/app/components/atoms/Text/Text';
import { Button } from '@/app/components/atoms/Button/Button';
import styles from './FilterButton.module.css';

export function FilterButton({ imageSrc, label, isSelected = false, onClick }) {
  return (
    <Button
      variant={"transparent"}
      onClick={onClick}
      className={styles.filterButton}
    >
      <Avatar
        src={imageSrc}
        alt={label}
        size="small"
        isSelected={isSelected}
        className={styles.avatar}
      />
      <Text variant="caption" weight="medium" color={isSelected ? "primary" : "secondary"}>
        {label}
      </Text>
    </Button>
  );
}