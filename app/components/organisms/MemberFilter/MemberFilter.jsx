"use client";
import { ARTMS_MEMBERS, TRIPLES_MEMBERS } from "@/app/lib/constants/members";
import { useObjektsStore } from "@/app/store/slices/objektSlice";
import { FilterButton } from "@/app/components/molecules/FilterButton/FilterButton";
import { Text } from "@/app/components/atoms/Text/Text";
import styles from "./MemberFilter.module.css";

export function MemberFilter() {
  const { selectedGroup, selectedFilter, setSelectedGroup, setSelectedFilter } = useObjektsStore();

  const groups = [
    { name: "ARTMS", members: ARTMS_MEMBERS },
    { name: "tripleS", members: TRIPLES_MEMBERS },
  ];

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
      <div className={styles.memberList}>
        <FilterButton
          imageSrc={selectedGroup === "ARTMS" ? "https://static.cosmo.fans/assets/artms-logo.png" : "https://static.cosmo.fans/assets/triples-logo.png"} // Add group images
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
  );
}