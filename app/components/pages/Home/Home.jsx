"use client";
import { useState } from "react";
import { useCatalog } from "@/app/hooks/useCatalog";
import { Card } from "@/app/components/molecules/Card/Card";
import { LoadingState } from "@/app/components/molecules/LoadingState/LoadingState";
import { MemberFilter } from "@/app/components/organisms/MemberFilter/MemberFilter";
import { Text } from "@/app/components/atoms/Text/Text";
import styles from "./Home.module.css";

export default function Home() {
  const { data: objekts, isLoading, isError, error } = useCatalog();
  const [selectedObjekt, setSelectedObjekt] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const objektCards = objekts?.map((objekt) => (
    <Card
      key={objekt._id || objekt.tokenId}
      imageSrc={objekt.frontImage || "/placeholder.png"}
      title={objekt?.metadata?.title?.split("#")[0].trim() || objekt.name.split("#")[0].trim()}
      onClick={() => {
        setSelectedObjekt(objekt);
        setIsFlipped(false);
      }}
    />
  ));

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  if (isError) {
    return (
      <div className={styles.error}>
        <Text variant="body" color="secondary">Error: {error.message}</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MemberFilter />
      <div className={styles.headerTitle}>
        <Text variant="heading2">Objekt Catalog</Text>
        <Text variant="heading4" color="secondary">({objekts?.length || 0})</Text>
      </div>
      {isLoading ? (
        <LoadingState count={16} />
      ) : (
        <div className={styles.grid}>{objektCards}</div>
      )}
      {selectedObjekt && (
        <div className={styles.modalOverlay} onClick={() => setSelectedObjekt(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedObjekt(null)}>X</button>
            <div className={styles.imageContainer}>
              <div
                className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''}`}
                onClick={handleCardClick}
              >
                <img
                  src={selectedObjekt.frontImage}
                  alt={`${selectedObjekt.metadata.title} (front)`}
                  className={`${styles.modalImage} ${styles.front}`}
                />
                    <img
                    src={selectedObjekt?.metadata?.metadata?.objekt?.backImage || selectedObjekt.backImage}
                    alt={`${selectedObjekt.metadata.title} (back)`}
                    className={`${styles.modalImage} ${styles.back}`}
                    />
                
              </div>
            </div>
            <Text variant="heading2" className={styles.modalTitle}>{selectedObjekt?.metadata?.title?.split("#")[0].trim() || selectedObjekt.name.split("#")[0].trim()}</Text>
            <Text variant="body" color="secondary">{`${selectedObjekt.member} - ${selectedObjekt.season}`}</Text>
          </div>
        </div>
      )}
    </div>
  );
}