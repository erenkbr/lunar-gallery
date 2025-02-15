"use client";
import Image from 'next/image';
import { ARTMS_MEMBERS } from '@/app/lib/constants/members';
import { useObjektsStore } from '@/app/store/slices/objektSlice';
import styles from './MemberFilter.module.css';

export function MemberFilter() {
  const { selectedMember, setSelectedMember } = useObjektsStore();

  return (
    <div className={styles.filterContainer}>
      <span className={styles.artmsText}>ARTMS</span>
      
      <div className={styles.memberList}>
        {ARTMS_MEMBERS.map((member) => (
          <button
            key={member.id}
            className={`${styles.filterButton} ${selectedMember === member.id ? styles.selected : ''}`}
            onClick={() => setSelectedMember(member.id)}
          >
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={40}
              height={40}
              className={styles.memberAvatar}
            />
          </button>
        ))}
      </div>
    </div>
  );
}