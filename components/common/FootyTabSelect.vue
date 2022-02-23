<template>
  <div class="footy-tab-select">
    <b-button-group>
      <b-button
        :variant="getVariant(option)"
        v-for="option in options"
        class="mr-2"
        :class="[buttonMode ? 'footy-button' : ' footy-tab-button']"
        :size="size"
        :key="typeof option == 'string' ? option : option.value"
        @click="setVal(option)"
        >{{ typeof option == "object" ? option.text : option }}</b-button
      >
    </b-button-group>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    size: String,
    options: Array,
    buttonMode: Boolean,
    value: [Object, String],
  },
  methods: {
    getVal(option) {
      if (typeof option == "object") {
        return option.value;
      } else {
        return option;
      }
    },
    setVal(option) {
      this.selected = this.getVal(option);
    },
    getVariant(option) {
      if (this.buttonMode) {
        return this.getVal(option) == this.selected ? "primary" : "secondary";
      } else {
        return this.getVal(option) == this.selected ? "primary" : "white";
      }
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
  },
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.footy-tab-select {
  overflow-x: auto;
  display: flex;
  margin-bottom: 12px;
  .btn-group {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }
  button.footy-tab-button {
    border-radius: 4px;
    border: none;
    font-weight: 500;
    // margin-bottom: 12px;
    height: 28px;
    padding: 5px 12px;
    margin-right: 8px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    padding-top: 6px;
  }
  flex-wrap: wrap;
  .btn-group,
  .btn-group-vertical {
    position: relative;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }
}

@media (max-width: $lg) {
  .footy-tab-select {
    button {
      // margin-bottom: 8px;
    }
  }
}
</style>
