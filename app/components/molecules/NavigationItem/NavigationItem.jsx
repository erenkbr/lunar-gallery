"use client";
import { Text } from '@/app/components/atoms/Text/Text';
import { IconButton } from '@/app/components/atoms/IconButton/IconButton';
import styles from './NavigationItem.module.css';

export function NavigationItem({ label, icon, onClick, isActive = false }) {
  return (
    <div
      className={`${styles.navItem} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {icon && <IconButton icon={icon} variant="ghost" label={label} />}
      <Text variant="label" weight={isActive ? "bold" : "regular"} color="primary">
        {label}
      </Text>
    </div>
  );
}