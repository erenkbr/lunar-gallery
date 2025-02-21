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
      <div className={styles.headerTitle}>
        <h2>Objekt Catalog </h2><h4> ({objekts?.length})</h4>
      </div>

      {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="card skeleton">
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
              </div>
            ))}
          </div>
      ) : (
        <div>
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
                    <h3 className={styles.cardTitle}>{cleanedName}</h3>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
