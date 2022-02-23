<template>
  <div class=" main-filters w-100">
    <div class="fixture-listing is-live w-100">
      <div class="timer-wrapper " style="width:20px">
        <sort-button
          @sortAscending="$emit('sortField', { field: 'country', order: 1 })"
          @sortDescending="$emit('sortField', { field: 'country', order: -1 })"
          :active="sortByField == 'country'"
          :order="sortByOrder"
        ></sort-button>
      </div>
      <div class="timer-wrapper ">
        <div class="half">
          <sort-button
            @sortAscending="$emit('sortField', { field: 'time', order: 1 })"
            @sortDescending="$emit('sortField', { field: 'time', order: -1 })"
            :active="sortByField == 'time'"
            :order="sortByOrder"
          ></sort-button>
        </div>
      </div>
      <div
        id="teams-wrapper"
        class="wrapper teams-wrapper d-none d-lg-flex"
      ></div>
      <div
        id="cards-wrapper"
        class="wrapper cards-wrapper d-none d-lg-flex row-gap-10 border-0"
      >
        <div class="yellow-red">
          <div
            class="soccer-card yellow-card d-flex align-items-center blind"
          ></div>
          <div class="soccer-card red-card blind"></div>
        </div>
      </div>
      <FixtureFilterButtons
        class="d-none d-lg-flex"
        @sortField="sortField"
        :sortByField="sortByField"
        :sortByOrder="sortByOrder"
      >
      </FixtureFilterButtons>
      <div class="reset-filter-wrapper">
        <div class="filter-button reset-filter-button">
          <b-button
            @click="resetFilters"
            class="footy-button footy-button-thin rounded-0 ml-auto"
            variant="light"
          >
            <span class="material-icons-outlined text-grey icon-left">
              restart_alt
            </span>
            <span class="text-dark cursor-pointer text-grey"
              >Reset Filters</span
            >
          </b-button>
        </div>
      </div>
      <FixtureFilterButtons
        class="d-lg-none"
        @sortField="sortField"
        :sortByField="sortByField"
        :sortByOrder="sortByOrder"
      >
      </FixtureFilterButtons>
    </div>
  </div>
</template>

<script>
import SortButton from "./common/SortButton.vue";
import FixtureFilterButtons from "./FixtureFilterButtons.vue";
export default {
  components: { SortButton, FixtureFilterButtons },
  props: {
    title: String,
    filter: Object,
    sortByField: null,
    sortByOrder: null
  },
  data() {
    return {
      activeAscend: true,
      activeDescend: true
    };
  },
  created() {
    if (process.browser) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener("scroll", this.handleScroll);
    }
  },
  beforeDestroy() {
    if (process.browser) {
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    handleScroll() {
      if (process.browser) {
        if (window.scrollY > 280 && window.innerWidth <= 768) {
          document.querySelector(".main-filters").classList.add("fixed");
        } else {
          document.querySelector(".main-filters").classList.remove("fixed");
        }
      }
    },

    sortAscending(field) {
      this.$emit("sortAscending", { field: field, value: true });
    },
    sortDescending(field) {
      this.$emit("sortDescending", { field: field, value: false });
    },
    sortField(value) {
      this.$emit("sortField", value);
    },
    resetFilters() {
      this.$emit("resetFilters");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/breakpoints";
.cursor-pointer {
  cursor: pointer;
}
.filter-wrapper {
  display: flex;
  flex-shrink: 0;
}
.filture-items-wrapper {
  border: 1px solid transparent;
  position: relative;
}
.filter-end-wrapper {
  display: flex;
  align-items: flex-end;
  h4 {
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  justify-content: flex-end;
  flex: 1;
  align-items: stretch;
  height: 100%;
  row-gap: 20px;
}

.reset-filter-button {
  //position: absolute;
  //right: 10px;
  //top: 20px;
}
.filter-wrapper-item {
  //min-width: 64px;
  border-right: 0px solid transparent;
  height: auto;
  div {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    padding: 4px;
    align-items: center;

    justify-content: center;
    // text-align: center;
    &.active {
      color: #60b15a !important;
    }
  }
}
.resetting-filters {
  display: flex;
}
.reset-filter-button {
  align-self: flex-end;
}

.reset-filter-wrapper {
  justify-content: flex-end;
  width: 100%;
  display: flex;
  flex: 1;
  margin-left: auto;
}
.filter-wrapper-item {
  row-gap: 16px;
  display: flex;
}
.main-filters {
  .fixture-wrapper {
    border: none;
  }
}
.sort-btns {
  display: flex;
  flex: 0 0 310px;
  max-width: 310px;
  width: 100%;
  align-items: center;
  .sort-btn {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    &:first-child {
      margin-left: 0px;
      max-width: 46px;
    }
    &:last-child {
      max-width: 75px;
    }
  }
}
.main-filters {
  display: flex;
  flex-shrink: 0;
  width: 100%;
  // justify-content: flex-end;

  .filter {
    display: flex;
    flex-direction: column;
    //   justify-content: center;
    align-items: center;
    // margin: 0 6px;
    max-width: 53px;
    min-width: 53px;
    box-sizing: border-box;
    &.active {
      .filter-funnel {
        #box {
          fill: #eef5ed;
        }
        #funnel {
          fill: #60b15a;
        }
      }
    }
    span.sort-btn {
      margin: 16px 0;
    }
  }
}
@media (max-width: $xl) {
  .main-filters {
    width: 100%;
    order: 3;
    flex: 0 0 100%;
    max-width: 100%;
    justify-content: center;
    margin-top: 20px;
  }
}

@media (max-width: $lg) {
  .main-filters {
    justify-content: flex-start;
  }
}
@media (max-width: $lg) {
  .main-filters {
    // justify-content: center;
    overflow-x: auto;
    &.fixed {
      margin: 0;
      position: fixed;
      top: 0;
      padding: 0px 15px 0px;
      right: 0;
      background: #fff;
      //padding: 20px 10px;
      box-shadow: 0 0 10px rgba(94, 177, 89, 0.5);

      z-index: 1021;
    }
    &::-webkit-scrollbar {
      width: 0; /* Remove scrollbar space */
      background: transparent; /* Optional: just make scrollbar invisible */
    }
  }
}
</style>
