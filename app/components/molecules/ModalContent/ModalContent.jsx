"use client";
import { Text } from '@/app/components/atoms/Text/Text';
import { Input } from '@/app/components/atoms/Input/Input';
import { Button } from '@/app/components/atoms/Button/Button';
import styles from './ModalContent.module.css';

export function ModalContent({
  title,
  description,
  inputValue,
  onInputChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className={styles.modalContent}>
      <Text variant="heading2" className={styles.title}>
        {title}
      </Text>
      <Text variant="body" color="secondary" className={styles.description}>
        {description}
      </Text>
      <Input
        type="email"
        value={inputValue}
        onChange={onInputChange}
        placeholder="cosmo@example.com"
        className={styles.input}
      />
      <div className={styles.actions}>
        <Button onClick={onSubmit} variant="primary">Submit</Button>
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
      </div>
    </div>
  );
}