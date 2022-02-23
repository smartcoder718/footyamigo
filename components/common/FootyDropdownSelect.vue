<template>
  <div v-if="options && options.length">
    <label v-if="label" class="footy-label"
      >{{ label }}
      <span v-if="info">
        <InfoIcon class="icon-right" :id="id + '-info'"> </InfoIcon>
        <b-popover
          :target="id + '-info'"
          variant="grey"
          triggers="hover"
          placement="topright"
        >
          {{ info }}
        </b-popover>
      </span>
    </label>
    <div
      class="footy-dropdown-select-wrapper"
      :class="!collapsed ? 'opened' : ''"
    >
      <button
        class="footy-dropdown-head footy-dropdown-item"
        @click="collapsed = !collapsed"
      >
        <b-img
          :src="selectedItem.image"
          class="dropdown-item-image"
          v-if="selectedItem.image"
        >
        </b-img>
        <div class="dropdown-item-text">
          {{
            selectedItem.text
              ? selectedItem.text
              : placeholder || "Select a value"
          }}
        </div>
      </button>

      <div class="dropdown-body-wrapper" @mouseleave="collapsed = true">
        <label
          @click="selected == option.value ? (collapsed = true) : null"
          class="footy-dropdown-body footy-dropdown-item"
          v-for="(option, index) in options"
          :key="index + option.value + $uuid.v4()"
        >
          <input type="radio" :value="option.value" v-model="selected" />
          <b-img
            :src="option.image"
            class="dropdown-item-image"
            v-if="option.image"
          >
          </b-img>
          <div class="dropdown-item-text">
            {{ option.text }}
            <b-badge v-if="option.new" variant="yellow" class="ml-2"
              >NEW</b-badge
            >
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    placeholder: String,
    options: { type: Array, default: () => [] },
    value: null,
    info: String,
    label: String,
    id: {
      type: String,
      default: function () {
        return this.$uuid.v4();
      },
    },
  },
  data() {
    return {
      collapsed: true,
    };
  },
  watch: {
    value() {
      this.collapsed = true;
    },
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    selectedItem() {
      return this.optionsObj[this.selected] || {};
    },
    optionsObj() {
      return Object.assign(
        {},
        ...this.options.map((option) => {
          return {
            [option.value]: option,
          };
        })
      );
    },
  },
  methods: {},
};
</script>
<style lang="scss">
@import "~assets/scss/colors";
.footy-dropdown-head {
  &::after {
    color: $dark;
  }
}
.footy-dropdown-select-wrapper {
  background: transparent;
  background: var(--bgcolor);
  position: relative;
  input[type="radio"] {
    opacity: 0;
    position: fixed;
    width: 0;
  }
  .dropdown-item-image {
    max-height: 44px;
    margin-right: 13px;
  }
  .footy-dropdown-item {
    background: #ffffff;
    border-top: 1px solid #d5ded5;
    box-sizing: border-box;
    //padding: 16px 20px;
    padding: 11px 13px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0px;
    .dropdown-item-text {
      padding: 5px 7px;
      color: $dark;
    }

    &.has-image {
      padding: 11px 13px;
    }
    &:hover {
      background: #f1f1f1;
    }
  }

  .dropdown-body-wrapper {
    height: 0;

    position: absolute;

    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
    visibility: hidden;
    border: 1px solid #d5ded5;
    transition: visibility 0s, opacity 0.5s linear;
    overflow: hidden;

    max-height: 514px;
    overflow-y: scroll;
    border-radius: 0px 0px 12px 12px;
    overflow: auto;
  }
  .footy-dropdown-head {
    border-radius: 12px;
    border: 1px solid #d5ded5;
  }
  &.opened {
    .dropdown-body-wrapper {
      height: auto;
      visibility: visible;
    }
    .footy-dropdown-head:after {
      content: "expand_less";
    }
    .footy-dropdown-head {
      border-radius: 12px 12px 0px 0px;
      border-bottom: none;
    }
    .footy-dropdown-body:last-child {
      border-radius: 0px 0px 12px 12px;
    }
  }
  .footy-dropdown-head:after {
    content: "expand_more";
    display: flex;
    text-align: right;
    position: absolute;
    top: 50%;
    font-size: 2rem;
    font-family: "Material Icons";
    right: 16px;
    transform: translateY(-50%);
  }
}
.borderless {
  button {
    border-radius: 0px !important;
    border: none !important;
  }
}
</style>
