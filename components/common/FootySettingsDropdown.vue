<template>
  <b-dropdown
    variant="lightpink"
    no-caret
    right
    dropdown
    no-flip
    class="footy-filter-dropdown settings-btn"
    offset="20"
    menu-class="shadow-sm p-0"
    ref="dropdown"
  >
    <template slot="button-content">
      <div class="content d-flex align-items-center" @click="toggleModal">
        <span class="material-icons-outlined icon-md mr-2" v-if="icon">
          {{ icon }}
        </span>
        <component :is="svgicon" v-else-if="svgicon" class="mr-2"> </component>
        <span class="text-grey">
          {{ text }}
        </span>
      </div>
    </template>

    <div class="modal--header">
      <h3>
        {{ text }}
      </h3>
      <close-icon @close="close"></close-icon>
    </div>

    <b-dropdown-item
      v-for="(option, i) in options"
      :key="i"
      @click="toggleSelected(option)"
    >
      <div class="toggle-li filter" :class="{ active: option.active }">
        <span class="text">
          {{ option.text }}
        </span>
        <footy-switch v-model="option.active"> </footy-switch>
      </div>
    </b-dropdown-item>
    <b-dropdown-item>
      <div class="toggle-li filter reload-btn">Reload</div>
    </b-dropdown-item>
  </b-dropdown>
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
    svgicon: null
  },
  computed: {
    selected: {
      get() {
        return this.text;
      },
      set(val) {
        this.$emit("input", val.text);
      }
    }
  },
  created() {
    console.log(this.options);
  },
  methods: {
    toggleModal() {
      this.$emit("toggleModal");
    },
    close() {
      this.toggleModal();
      this.$refs.dropdown.hide(true);
    },
    toggleSelected(option) {
      this.selected = option;
      this.toggleModal();
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";

.footy-filter-dropdown {
  button,
  a {
    // font-weight: bold !important; //COLFAX
    font-size: 16px;
    line-height: 24px;
  }
  .dropdown-item {
    border-bottom: 1px solid #f0f1f0;
    padding: 12px;
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
        padding: 0;
      }
    }
  }
  .toggle-li {
    cursor: pointer;
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    height: auto;
  }
  .toggle-li.filter {
    height: 100%;
    padding: 15px;
    padding: 8px 8px 8px 12px;
    &.active {
      .text {
        color: #60b15a;
      }
    }
    .text {
      // font-family: "Poppins"; //REPLACEDTEMPORARILY //REPLACED
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 18px;
    }
  }

  .reload-btn {
    justify-content: center;
    background: #eef5ed;
    box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.05);
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #60b15a;
  }
}
.settings-btn {
  .dropdown-menu {
    &.show {
      min-width: 219px;
      width: 100%;
    }
  }
}

.modal--header {
  display: none;
}
@media (max-width: $lg) {
  .settings-btn {
    .dropdown-menus {
      &.show {
        z-index: 1051;
        min-width: calc(100vw - 32px);
        background: transparent;
        background: #f7f9f7;
        border-radius: 20px;
        top: 78px !important;
        padding: 16px 0px 0px 0px !important;
        padding-bottom: 0px !important;
        border-radius: 20px !important;
        transform: none !important;
        position: fixed !important;
        left: 16px !important;
        right: 16px !important;
        width: auto;
        .dropdown-item {
          height: 52px;
          .toggle-li.filter {
            padding: 0px 12px !important;
          }
        }
        li {
          margin: 0 16px !important;
          &:last-child {
            margin: 0px !important;
            // border-radius: ;
            border-bottom-left-radius: 20px !important;
            border-bottom-right-radius: 20px !important;
          }
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
      }
    }
  }
  .settings-btn {
    button.dropdown-toggle {
      padding: 11px 14px;
    }
  }
}
</style>
