"use client";

import { forwardRef } from 'react';
import styles from './Input.module.css';

export const Input = forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''} ${className}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${icon ? styles.hasIcon : ''}`}
        {...props}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
});

Input.displayName = 'Input';