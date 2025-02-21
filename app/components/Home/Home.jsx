"use client";
import { useCatalog } from "@/app/hooks/useCatalog";
import styles from "./Home.module.css";
import { MemberFilter } from "@/app/components/MemberFilter/MemberFilter";

export default function Home() {
  const { data: objekts, isLoading, isError, error } = useCatalog();

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
          {objekts?.map((objekt) => {
            const cleanedName = objekt.name.split('#')[0].trim();
            return (
              <div key={objekt._id || objekt.tokenId} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src={objekt.frontImage || "/placeholder.png"}
                    alt={cleanedName}
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>{cleanedName}</h4>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
