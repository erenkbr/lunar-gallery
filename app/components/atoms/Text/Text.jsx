"use client";

import styles from './Text.module.css';

export function Text({
  children,
  as = 'p',
  variant = 'body', // heading1, heading2, heading3, body, caption, label
  weight = 'regular', // regular, medium, semibold, bold
  color = 'primary', // primary, secondary, disabled
  className = '',
  ...props
}) {
  const Component = as;
  
  return (
    <Component
      className={`
        ${styles.text}
        ${styles[variant]}
        ${styles[weight]}
        ${styles[`color-${color}`]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}