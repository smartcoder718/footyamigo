<template>
  <div class="summary-wrapper">
    <b-dropdown
      no-caret
      variant="light"
      dropleft
      ref="mydropdown"
      class="summary-dropdown-wrapper d-none d-lg-block filter-button"
    >
      <template slot="button-content">
        <div class="centered">
          <span
            class="material-icons-outlined icon-md mr-2 text-grey"
            v-if="icon"
          >
            {{ icon }}
          </span>
          <component :is="svgicon" v-else-if="svgicon" class="mr-2">
          </component>
          <span class="text-grey">
            Summary
          </span>
        </div>
      </template>
      <b-dropdown-item>
        <div class="summary-items">
          <div class="summary-item ">
            Total Games Having Your Desired <br />
            Outcome Odds:
            <span class="text-primary"> {{ summary.count }}</span>
          </div>
          <div class="summary-item">
            Total No. of Bets Won:
            <span class="text-primary">{{ summary.wins }} Games </span>
          </div>
          <div class="summary-item">
            Total No. of Bets Lost:
            <span class="text-danger">{{ summary.losses }} Games</span>
          </div>
          <div class="summary-item">
            Total Stake:
            <span class="text-primary">£{{ summary.wager }} </span>
          </div>
          <div class="summary-item">
            Total Returns:
            <span class="text-primary">£{{ summary.revenue }} </span>
          </div>
          <div class="summary-item">
            Return on Investment:
            <span class="text-primary">{{ summary.roi }}% </span>
          </div>
          <div class="summary-item">
            Win/Loss
            <span
              class="text-primary"
              :class="summary.profit >= 0 ? 'text-success' : 'text-danger'"
              >£{{ summary.profit }}</span
            >
          </div>

          <div class="small ">
            <em class="fw-normal">
              Assuming you placed a £100 bet <br />
              in each game
            </em>
          </div>
        </div>
      </b-dropdown-item>
      <slot> </slot>
    </b-dropdown>

    <div class="d-lg-none filter-button">
      <b-button @click="toggleModal" variant="light" class="centered">
        <span class="material-icons-outlined icon-md mr-2" v-if="icon">
          {{ icon }}
        </span>
        <component :is="svgicon" v-else-if="svgicon" class="mr-2"> </component>
        <span class="text-grey">
          {{ text }}
        </span>
      </b-button>
      <b-modal
        :modal-class="[showuse ? 'show-use' : '', 'summary-dropdown-modal']"
        centered
        v-model="activeModal"
        :title="text"
        hide-footer
        content-class="summary-modal-content"
      >
        <b-list-group>
          <b-list-group-item style="display:grid; justify-content:center;">
            <div class="summary-items ">
              <div class="summary-item ">
                Total Games Having Your Desired <br />
                Outcome Odds:
                <span class="text-primary"> {{ summary.count }}</span>
              </div>
              <div class="summary-item">
                Total No. of Bets Won:
                <span class="text-primary">{{ summary.wins }} Games </span>
              </div>
              <div class="summary-item">
                Total No. of Bets Lost:
                <span class="text-danger">{{ summary.losses }} Games</span>
              </div>
              <div class="summary-item">
                Total Stake:
                <span class="text-primary">£{{ summary.wager }} </span>
              </div>
              <div class="summary-item">
                Total Returns:
                <span class="text-primary">£{{ summary.revenue }} </span>
              </div>
              <div class="summary-item">
                Return on Investment:
                <span class="text-primary">{{ summary.roi }}% </span>
              </div>
              <div class="summary-item">
                Win/Loss
                <span
                  class="text-primary"
                  :class="summary.profit >= 0 ? 'text-success' : 'text-danger'"
                  >£{{ summary.profit }}</span
                >
              </div>

              <div class=" mt-2">
                <em class="fw-normal">
                  Assuming you placed a £100 bet <br />
                  in each game
                </em>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-modal>
    </div>
  </div>
</template>

<script>
import CloseIcon from "../common/CloseIcon.vue";
export default {
  components: { CloseIcon },

  props: {
    type: {
      type: String,
      default: "text"
    },
    text: String,
    icon: String,
    options: Array,
    value: null,
    svgicon: null,
    showuse: Boolean,
    summary: Object
  },
  data() {
    return {
      activeClass: "active-dropdown",
      activeModal: false
    };
  },
  methods: {
    select(value) {
      // console.log(value);
      this.selected = value;
      this.toggleModal();
    },
    toggleModal() {
      this.activeModal = !this.activeModal;
    }
  },
  mounted() {},
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
    /*selectedText() {
      const selected = this.hashMap[this.selected];
      if (selected) {
        return selected.text;
      }
    },
    hashMap() {
      return Object.assign(
        {},
        ...this.options.map(option => {
          return { [option.value]: option };
        })
      );
    }*/
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.summary-items {
  .summary-item {
    font-weight: 500;
  }
  font-size: 13px;
  line-height: 18px;

  display: grid;
  gap: 20px;
  .summary-item {
    font-weight: 500;
  }
}
.summary-dropdown-wrapper {
  .dropdown-item {
    padding: 12px !important;
    // font-size: 12px;
    // line-height: 18px;
    // display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: text;
  }

  .active-dropdown {
    .dropdown-item {
      color: $primary;
    }
    .dropdown-item::after {
      display: none;
    }
  }
}

.summary-dropdown-modal,
.summary-dropdown-wrapper {
  & + .modal-backdrop {
    background: white;
    opacity: 0.9;
  }
  .summary-modal-content {
    background: #f7f9f7;
    border: none;
    border-radius: 20px;
  }
  .list-group-item {
    border: none;
    border-bottom: 1px solid $lightgrey;
    background: transparent;
    padding: 12px !important;

    display: grid;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    &.active-dropdown {
      color: $primary;
      &::after {
        display: none;
      }
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
