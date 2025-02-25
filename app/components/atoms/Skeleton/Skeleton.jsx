"use client";

import styles from './Skeleton.module.css';

export function Skeleton({
  variant = 'rect', // rect, circle, text
  width,
  height,
  count = 1,
  className = '',
  ...props
}) {
  const renderSkeleton = (key) => (
    <div
      key={key}
      className={`
        ${styles.skeleton}
        ${styles[variant]}
        ${className}
      `}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );

  // Return multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className={styles.skeletonGroup}>
        {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
      </div>
    );
  }

  // Return single skeleton
  return renderSkeleton(0);
}