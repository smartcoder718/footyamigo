<template>
  <div class="filter-wrapper">
    <div
      class="wrapper live-wrapper-item border-0 row-gap-20"
      v-for="(filter, i) in filters"
      :key="i"
      :class="{ active: filter.active }"
    >
      <sort-button
        :active="sortByField == filter.field"
        :order="sortByOrder"
        @sortAscending="$emit('sortField', { field: filter.field, order: 1 })"
        @sortDescending="$emit('sortField', { field: filter.field, order: -1 })"
      ></sort-button>

      <img
        :src="filter.img"
        v-b-tooltip.hover.bottom
        style=""
        :title="filter.name"
        :alt="filter.title"
        class="cursor-pointer"
        :class="[sortByField == filter.field ? 'active-filter-icon' : '']"
      />
    </div>
  </div>
</template>

<script>
import SortButton from "./common/SortButton.vue";
export default {
  props: {
    sortByField: null,
    sortByOrder: null
  },
  components: { SortButton },
  data() {
    return {
      filters: [
        {
          id: 1,
          ascendingActive: false,
          descendingActive: false,
          title: "socer",
          img: "/filtersicon/socer.svg",
          active: false,
          name: "Goals",
          field: "goals"
        },
        {
          id: 2,
          ascendingActive: false,
          descendingActive: false,
          title: "corner2",
          img: "/filtersicon/corner2.svg",
          active: true,
          name: "Corners",
          field: "corners"
        },
        {
          id: 3,
          ascendingActive: false,
          descendingActive: false,
          title: "goal3",
          img: "/filtersicon/goal3.svg",
          active: false,
          name: "Shots on Target",
          field: "shots_on_target"
        },
        {
          id: 4,
          ascendingActive: false,
          descendingActive: false,
          title: "goal2",
          img: "/filtersicon/goal2.svg",
          active: false,
          name: "Shots off Target",
          field: "shots_off_target"
        },
        {
          id: 5,
          ascendingActive: false,
          descendingActive: false,
          title: "field1",
          img: "/filtersicon/field1.svg",
          active: false,
          name: "Possession",
          field: "possession"
        },
        {
          id: 6,
          ascendingActive: false,
          descendingActive: false,
          title: "flash1",
          img: "/filtersicon/flash1.svg",
          active: false,
          name: "Momentum",
          field: "momentum"
        },
        {
          id: 7,
          ascendingActive: false,
          descendingActive: false,
          title: "flash2",
          img: "/filtersicon/flash2.svg",
          active: false,
          name: "Dangerous Attacks",
          field: "dangerous_attacks"
        }
        // {
        //   id: 8,
        //   ascendingActive: false,
        //   descendingActive: false,
        //   title: "penalty1",
        //   img: "/filtersicon/penalty1.svg",
        //   active: false,
        // },
      ]
    };
  }
};
</script>

<style>
.active-filter-icon {
  filter: invert(58%) sepia(62%) saturate(362%) hue-rotate(68deg)
    brightness(94%) contrast(88%);
}
</style>
