<template>
  <div>
    <b-dropdown
      no-flip
      no-caret
      variant="light"
      dropdown
      ref="mydropdown"
      class="footy-filter-dropdown-wrapper d-none d-lg-block filter-button"
      :class="[showuse ? 'show-use' : '']"
    >
      <template slot="button-content">
        <div class="centered">
          <span class="material-icons-outlined icon-md mr-2" v-if="icon">
            {{ icon }}
          </span>
          <component :is="svgicon" v-else-if="svgicon" class="mr-2">
          </component>
          <span class="text-grey">
            {{ text }}
          </span>
        </div>
      </template>
      <b-dropdown-item
        v-for="(option, index) in options"
        :key="index"
        @click="select(option.value)"
        :class="[option.value == selected ? activeClass : '']"
        >{{ option.text }}</b-dropdown-item
      >
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
        :modal-class="[
          showuse ? 'show-use' : '',
          'footy-filter-dropdown-modal'
        ]"
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
            @click="[select(option.value), toggleModal()]"
            :class="[option.value == selected ? activeClass : '']"
            >{{ option.text }}</b-list-group-item
          >
        </b-list-group>
      </b-modal>
    </div>
  </div>
</template>

<script>
import CloseIcon from "./CloseIcon.vue";
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
    showuse: Boolean
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
.footy-filter-dropdown-wrapper {
  .dropdown-item {
    padding: 12px !important;
    font-size: 12px;
    line-height: 18px;
    display: flex;
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

.footy-filter-dropdown-modal,
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
  &.show-use {
    .list-group-item::after {
      content: "USE";
      margin-left: 16px;
      color: $primary;
    }
  }
}
</style>
