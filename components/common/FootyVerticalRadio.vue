<template>
  <div class="footy-vertical-radio-container">
    <label for="" v-if="label">{{ label }}</label>
    <div class="radio-container">
      <div v-if="filtered">
        <input
          type="text"
          placeholder="Filter...."
          class="footy-input radio-filter"
          v-model="searchText"
        />
      </div>
      <div class="radio-container-items" :class="size">
        <div
          v-for="(option, index) in values"
          :key="index"
          class="radio-invisible footy-radio"
        >
          <input
            type="radio"
            class="radio-invisible-input"
            :id="'radio' + index"
            :value="option.value"
            v-model="selected"
          />

          <label
            :for="'radio' + index"
            class="radio-invisible-label"
            :class="selected == option.value ? 'bg-light' : ''"
            >{{ option.text }}</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Array,
    value: null,
    label: String,
    filtered: Boolean,
    size: String
  },
  data() {
    return {
      checkedState: new Array(this.options.length).fill(false),
      checkedItems: [],
      searchText: ""
    };
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    values() {
      if (this.searchText.length === 0) return this.options;
      return this.options.filter(option => {
        return (
          option.text.toUpperCase().indexOf(this.searchText.toUpperCase()) != -1
        );
      });
    }
  }
};
</script>

<style lang="scss">
.footy-vertical-radio-container {
  .radio-container {
    border: 1px solid #d5ded5;
    border-radius: 12px;
    overflow: hidden;
  }
  .radio-container-items {
    max-height: 514px;
    overflow-y: auto;
    height: 100%;
    &.sm {
      max-height: 370px;
    }
  }
  .radio-filter {
    width: 100%;
    border: none;
    padding: 15px;
    border-radius: 0px;
    border-bottom: 1px solid #f0f1f0;
  }
  .radio-invisible-input {
    & + label {
      width: 100%;
      margin-bottom: 0px;
      display: block;
      font-size: 14px;
      border: none !important;
      border-radius: 0px !important;
      border-bottom: 1px solid #f0f1f0 !important;
      display: flex;

      &.checked {
        background: transparent;
      }
    }
  }
}
</style>
