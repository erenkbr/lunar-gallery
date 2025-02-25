"use client";

import styles from './IconButton.module.css';

export function IconButton({
  icon,
  variant = 'ghost', // primary, secondary, ghost
  size = 'medium', // small, medium, large
  label, // Accessibility label
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`
        ${styles.iconButton}
        ${styles[variant]}
        ${styles[size]}
        ${className}
      `}
      onClick={onClick}
      aria-label={label}
      {...props}
    >
      {isLoading ? (
        <span className={styles.loader}></span>
      ) : (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  );
}