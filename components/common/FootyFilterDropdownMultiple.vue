<template>
  <div>
    <b-dropdown
      no-flip
      no-caret
      variant="light"
      dropdown
      ref="mydropdown"
      class="footy-filter-dropdown-wrapper footy-filter-dropdown-multiple d-none d-lg-block filter-button"
      toggle-class="centered"
    >
      <template slot="button-content" class="laorapy">
        <span class="material-icons-outlined icon-md mr-2" v-if="icon">
          {{ icon }}
        </span>
        <component :is="svgicon" v-else-if="svgicon" class="mr-2"> </component>
        <span class="text-grey">
          {{ text }}
        </span>
      </template>
      <b-list-group class="dropdown-item bg-white text-body">
        <b-list-group-item
          v-for="(option, index) in options"
          :key="index"
          :class="[selected.includes(option.value) ? activeClass : '']"
          :disabled="option.disabled"
          ><span class="footy-filter-dropdown-text text-grey">{{
            option.text
          }}</span>
          <label class="footy-switch ml-3">
            <input
              type="checkbox"
              :value="option.value"
              v-model="selected"
              :id="$uuid.v4()"
            />
            <span class="footy-switch-slider"></span>
          </label>
        </b-list-group-item>
      </b-list-group>

      <slot> </slot>
    </b-dropdown>

    <div class="d-lg-none filter-button">
      <b-button @click="toggleModal" variant="light" class="centered dropdown-toggle-no-caret">
        <span class="material-icons-outlined icon-md mr-2" v-if="icon">
          {{ icon }}
        </span>
        <component :is="svgicon" v-else-if="svgicon" class="mr-2"> </component>
        <span class="text-grey">
          {{ text }}
        </span>
      </b-button>
      <b-modal
        modal-class="footy-filter-dropdown-modal"
        centered
        v-model="activeModal"
        :title="text"
        hide-footer
        content-class="footy-filter-modal-content"
      >
        <b-list-group>
          <b-list-group-item
            v-for="(option, index) in options"
            :key="index"
            :class="[selected.includes(option.value) ? activeClass : '']"
            >{{ option.text }}
            <label class="footy-switch ml-3">
              <input
                type="checkbox"
                :value="option.value"
                v-model="selected"
                :id="$uuid.v4()"
                @click="toggleModal"
              />
              <span class="footy-switch-slider"></span> </label
          ></b-list-group-item>
        </b-list-group>
      </b-modal>
    </div>
  </div>
</template>

<script>
import CloseIcon from "./CloseIcon.vue";
import FootySwitch from "./FootySwitch.vue";
export default {
  components: { CloseIcon, FootySwitch },
  props: {
    type: {
      type: String,
      default: "text"
    },
    text: String,
    icon: String,
    options: Array,
    value: Array,
    svgicon: null,
    showuse: Boolean
  },
  data() {
    return {
      activeClass: "active-dropdown",
      activeModal: false,
      selectedIndices: this.options.map(x => false)
    };
  },
  methods: {
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
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.footy-filter-dropdown-wrapper {
  &.footy-filter-dropdown-multiple {
    .dropdown-item {
      padding: 0px !important;
    }
    .list-group-item {
      width: 100%;
    }
  }
}

/*
.footy-filter-dropdown-wrapper {
  .dropdown-item {
    padding: 0px;
    font-size: 12px;
    line-height: 18px;
    display: flex;
    text-align: left;
    justify-content: space-between;
    align-items: center;
  }
  &.show-use {
    .dropdown-item::after {
      content: "USE";
      margin-left: 16px;
      color: $primary;
    }
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

.footy-filter-dropdown-modal-2,
.footy-filter-dropdown-wrapper {
  & + .modal-backdrop {
    background: white;
    opacity: 0.9;
  }
  .footy-filter-modal-content {
    background: #f7f9f7;
    border: none;
    border-radius: 20px;
  }
  .list-group-item {
    border: none;
    border-bottom: 1px solid $lightgrey;
    background: transparent;
    padding: 12px !important;
    font-size: 12px;
    line-height: 18px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
    align-items: center;
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
  &.show-use {
    .list-group-item::after {
      content: "USE";
      margin-left: 16px;
      color: $primary;
    }
  }
}*/
</style>
