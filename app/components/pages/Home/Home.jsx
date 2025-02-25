"use client";
import { useCatalog } from "@/app/hooks/useCatalog";
import { Card } from "@/app/components/molecules/Card/Card";
import { LoadingState } from "@/app/components/molecules/LoadingState/LoadingState";
import { MemberFilter } from "@/app/components/organisms/MemberFilter/MemberFilter";
import { Text } from "@/app/components/atoms/Text/Text";
import { useMemo } from "react";
import styles from "./Home.module.css";

export default function Home() {
  const { data: objekts, isLoading, isError, error } = useCatalog();

  const objektCards = useMemo(() => {
    if (!objekts) return null;
    return objekts.map((objekt) => {
      const cleanedName = objekt.name.split("#")[0].trim();
      console.log(objekt)
      return (
        <Card
          key={objekt._id || objekt.tokenId}
          imageSrc={objekt.frontImage || "/placeholder.png"}
          title={objekt?.metadata?.title?.split("#")[0].trim() || cleanedName}
        />
      );
    });
  }, [objekts]);

  if (isError) {
    return (
      <div className={styles.error}>
        <Text variant="body" color="secondary">
          Error: {error.message}
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MemberFilter />
      <div className={styles.headerTitle}>
        <Text variant="heading2">Objekt Catalog</Text>
        <Text variant="heading4" color="secondary">
          ({objekts?.length || 0})
        </Text>
      </div>
      {isLoading ? (
        <LoadingState count={16} />
      ) : (
        <div className={styles.grid}>{objektCards}</div>
      )}
    </div>
  );
}