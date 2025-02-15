"use client";
import { useObjekts } from "@/app/hooks/useObjekts";
import styles from "./Home.module.css";
import { MemberFilter } from "@/app/components/MemberFilter/MemberFilter";

export default function Home() {
  const { data: objekts, isLoading, isError, error } = useObjekts();

  if (isError) {
    return (
      <div className={styles.error}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MemberFilter />
      {isLoading ? (
        <p>Loading Objekts...</p>
      ) : (
        <div className={styles.grid}>
          {objekts?.map((objekt) => (
            <div key={objekt.id} className={styles.card}>
              <img src={objekt.image} alt={objekt.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}