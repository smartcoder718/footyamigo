<template>
  <b-dropdown
    variant="lightpink"
    no-caret
    right
    dropdown
    no-flip
    class="footy-league-status league-status-btn"
    offset="20"
    menu-class="shadow-sm p-0"
    ref="dropdown"
  >
    <template slot="button-content">
      <div class="content d-flex align-items-center" @click="toggleModal">
        <span class="material-icons-outlined icon-md" v-html="icon" v-if="icon">
          {{ icon }}
        </span>
        <span class="text ml-2">
          {{ text }}
        </span>
      </div>
    </template>

    <div class="modal--header">
      <h3>
        {{ text }}
      </h3>
      <div class="close-icon" @click="close">
        <span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.32741 6.00016L11.0383 2.28922C11.2145 2.11341 11.3135 1.87484 11.3138 1.62599C11.314 1.37714 11.2153 1.13839 11.0395 0.962271C10.8637 0.78615 10.6251 0.687084 10.3763 0.686864C10.1274 0.686644 9.88868 0.785289 9.71256 0.961099L6.00163 4.67204L2.29069 0.961099C2.11457 0.784979 1.8757 0.686035 1.62663 0.686035C1.37755 0.686035 1.13868 0.784979 0.962564 0.961099C0.786443 1.13722 0.6875 1.37609 0.6875 1.62516C0.6875 1.87423 0.786443 2.1131 0.962564 2.28922L4.6735 6.00016L0.962564 9.7111C0.786443 9.88722 0.6875 10.1261 0.6875 10.3752C0.6875 10.6242 0.786443 10.8631 0.962564 11.0392C1.13868 11.2153 1.37755 11.3143 1.62663 11.3143C1.8757 11.3143 2.11457 11.2153 2.29069 11.0392L6.00163 7.32829L9.71256 11.0392C9.88868 11.2153 10.1276 11.3143 10.3766 11.3143C10.6257 11.3143 10.8646 11.2153 11.0407 11.0392C11.2168 10.8631 11.3158 10.6242 11.3158 10.3752C11.3158 10.1261 11.2168 9.88722 11.0407 9.7111L7.32741 6.00016Z"
              fill="#374336"
            />
          </svg>
        </span>
      </div>
    </div>
    <!-- <div class="dropdown-items"> -->
    <div class="fixtures-leagues" v-for="(fixture, i) in fixtures" :key="i">
      <b-dropdown-item
        @click="toggleSelected"
        v-for="(item, i) in probability_scroller"
        :key="i"
      >
        <span class="key-text">
          {{ item.title }}
        </span>
        <span class="key-value" v-if="fixture.probability">
          {{ fixture.probability[item.col] }}%
        </span>
      </b-dropdown-item>
    </div>

    <!-- </div> -->
  </b-dropdown>
</template>

<script>
import probability_scroller from "~/components/json/probability-scroller.json";
export default {
  props: {
    text: String,
    icon: String,
    fixtures: Array,
    value: null
  },
  data() {
    return {
      probability_scroller
    };
  },
  components: {},
  methods: {
    toggleModal() {
      this.$emit("toggleModal");
    },
    close() {
      this.toggleModal();
      this.$refs.dropdown.hide(true);
    },
    // toggleSelected(option) {
    toggleSelected() {
      // this.selected = option;
      this.toggleModal();
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.footy-league-status {
  margin-right: 0px !important;
  width: 132px !important;
  button.dropdown-toggle {
    height: 32px !important;
    border: none !important;
    width: 100%;
    max-width: 100% !important;
    &:hover {
      background: transparent !important;
    }
  }
  .content {
    .text {
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 21px;
      color: #e4af5e !important;
    }
  }
  .dropdown-item {
    border-bottom: 1px solid #f0f1f0;
    // padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 41px;
    &:focus {
      background: transparent;
    }
  }
  .dropdown-menu {
    border: 1px solid #eef5ed;
    box-sizing: border-box;
    box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    &.show {
      .dropdown-item {
        padding: 0px 12px;
        .key-text {
          // font-family: "Poppins"; //REPLACEDTEMPORARILY //REPLACED
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 18px;
          color: #60685f;
        }
        .key-value {
          // font-family: "Poppins"; //REPLACEDTEMPORARILY //REPLACED
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 18px;

          
        }
      }
      //   right: 100%;
      width: 100%;
      min-width: 400px;
      //   left: 0;
    }
  }
}
.fixtures-leagues {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal--header {
  display: none;
}
@media (max-width: $lg) {
  .league-status-btn {
    .dropdown-menu {
      &.show {
        transform: none !important;
        z-index: 1051;
        min-width: calc(100vw);
        background: transparent;
        left: 0px;
        background: purple;
        background: #f7f9f7;
        border-radius: 20px;
        top: 240px !important;
        border-radius: 20px 20px 0px 0px !important;
        position: fixed !important;
        padding: 16px !important;
        bottom: 0px !important;

        .dropdown-item {
          height: 52px;
          .toggle-li.filter {
            padding: 0px 12px !important;
          }
        }
        li {
          // margin: 0 16px !important;
        }
      }
      border: none !important;
      box-shadow: none;
      border-radius: 0px !important;
    }
    .modal--header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 0 16px;
      .close-icon {
        cursor: pointer;
        background: #ffffff;
        border-radius: 8px;
        width: 44px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          color: crimson;
        }
      }
      h3 {
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
        line-height: 36px;
        
        // font-family: "Poppins"; //REPLACEDTEMPORARILY //REPLACED
      }
    }
  }
  .fixtures-leagues {
    height: 100px;
    overflow-y: auto;
  }
}
</style>
