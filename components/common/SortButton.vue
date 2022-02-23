<template>
  <span class="sort-btn">
    <svg
      width="16"
      height="21"
      viewBox="0 0 16 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.7">
        <path
          id="sortAscending"
          class="cursor-pointer"
          :class="[{ active }, { orderActive: order == -1 }]"
          d="M13.5858 8.3335C14.4767 8.3335 14.9229 7.25635 14.2929 6.62639L8.70711 1.0406C8.31658 0.650077 7.68342 0.650078 7.29289 1.0406L1.70711 6.62639C1.07714 7.25635 1.52331 8.33349 2.41421 8.33349L13.5858 8.3335Z"
          fill="#60685F"
          @click="sortAscending()"
        />
        <path
          id="sortDescending"
          class="cursor-pointer"
          :class="[{ active }, { orderActive: order == 1 }]"
          d="M2.41421 12.3335C1.52331 12.3335 1.07714 13.4106 1.70711 14.0406L7.29289 19.6264C7.68342 20.0169 8.31658 20.0169 8.70711 19.6264L14.2929 14.0406C14.9229 13.4106 14.4767 12.3335 13.5858 12.3335L2.41421 12.3335Z"
          fill="#60685F"
          @click="sortDescending()"
          
        />
      </g>
    </svg>
  </span>
</template>

<script>
export default {
  props: {
    activeAscend: Boolean,
    activeDescend: Boolean,
    active: Boolean,
    order: Number
  },
  methods: {
    sortAscending() {
      this.$emit("sortAscending");
    },
    sortDescending() {
      this.$emit("sortDescending");
    }
  }
};
</script>

<style lang="scss" scoped>
.sort-btn {
  .active {
    fill: #60b15a;

    &.orderActive {
      fill: rgba(94, 177, 89, 0.5);
    }
  }
}
</style>
