"use client";
import { ARTMS_MEMBERS, TRIPLES_MEMBERS } from "@/app/lib/constants/members";
import { useObjektsStore } from "@/app/store/slices/objektSlice";
import { FilterButton } from "@/app/components/molecules/FilterButton/FilterButton";
import { Text } from "@/app/components/atoms/Text/Text";
import { useFilters } from "@/app/hooks/useFilters";
import { LoadingState } from "@/app/components/molecules/LoadingState/LoadingState";
import styles from "./MemberFilter.module.css";

export function MemberFilter() {
  const { 
    selectedGroup, 
    selectedFilter, 
    selectedSeason, 
    selectedCollection, 
    selectedClass, 
    setSelectedGroup, 
    setSelectedFilter, 
    setSelectedSeason, 
    setSelectedCollection, 
    setSelectedClass 
  } = useObjektsStore();

  const { data: filterOptions, isLoading, isError, error } = useFilters();

  const groups = [
    { name: "ARTMS", members: ARTMS_MEMBERS },
    { name: "tripleS", members: TRIPLES_MEMBERS },
  ];

  if (isLoading) {
    return <LoadingState count={4} />;
  }

  if (isError) {
    return (
      <div className={styles.error}>
        <Text variant="body" color="secondary">
          Error loading filters: {error.message}
        </Text>
      </div>
    );
  }

  const { seasons, collections, classes } = filterOptions || { seasons: [], collections: [], classes: [] };

  return (
    <div className={styles.filterContainer}>
      {/* Group Tabs */}
      <div className={styles.groupTabs}>
        {groups.map((group) => (
          <Text
            key={group.name}
            variant="heading2"
            weight={selectedGroup === group.name ? "bold" : "regular"}
            className={styles.groupTab}
            onClick={() => setSelectedGroup(group.name)}
            role="button"
          >
            {group.name}
          </Text>
        ))}
      </div>

      {/* Member Filters */}
      <div className={styles.filterSection}>
        <Text variant="heading3" className={styles.sectionTitle}>Members</Text>
        <div className={styles.memberList}>
          <FilterButton
            imageSrc={selectedGroup === "ARTMS" ? "https://static.cosmo.fans/assets/artms-logo.png" : "https://static.cosmo.fans/assets/triples-logo.png"}
            label="All"
            isSelected={!selectedFilter}
            onClick={() => setSelectedFilter(null)}
          />
          {groups.find((g) => g.name === selectedGroup).members.map((member) => (
            <FilterButton
              key={member.id}
              imageSrc={member.imageUrl}
              label={member.name}
              isSelected={selectedFilter === member.name}
              onClick={() => setSelectedFilter(member.name)}
            />
          ))}
        </div>
      </div>

      {/* Other Filters (Dropdowns) */}
      <div className={styles.dropdownContainer}>
        {/* Season Dropdown */}
        <div className={styles.dropdownWrapper}>
          <label htmlFor="season-select" className={styles.label}>Season</label>
          <select
            id="season-select"
            value={selectedSeason || ""}
            onChange={(e) => setSelectedSeason(e.target.value || null)}
            className={styles.dropdown}
          >
            <option value="">All Seasons</option>
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        {/* Collection Dropdown */}
        <div className={styles.dropdownWrapper}>
          <label htmlFor="collection-select" className={styles.label}>Collection</label>
          <select
            id="collection-select"
            value={selectedCollection || ""}
            onChange={(e) => setSelectedCollection(e.target.value || null)}
            className={styles.dropdown}
          >
            <option value="">All Collections</option>
            {collections.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>
        </div>

        {/* Class Dropdown */}
        <div className={styles.dropdownWrapper}>
          <label htmlFor="class-select" className={styles.label}>Class</label>
          <select
            id="class-select"
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className={styles.dropdown}
          >
            <option value="">All Classes</option>
            {classes.map((classType) => (
              <option key={classType} value={classType}>
                {classType}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}