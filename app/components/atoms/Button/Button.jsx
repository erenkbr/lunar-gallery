"use client";
import styles from './Button.module.css';

export function Button({
  variant = "primary",
  size = "medium",
  onClick,
  children,
  disabled = false,
  className = "",
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}