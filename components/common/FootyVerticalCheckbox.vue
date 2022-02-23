<template>
  <div class="footy-vertical-checkbox">
    <div class="d-flex justify-content-between align-items-center py-2">
      <label for="" v-if="label" class="footy-label">{{ label }}</label>
      <label
        v-if="outcomes"
        class="cursor-pointer text-primary footy-label"
        @click="checkAll"
      >
        {{ selected.length == 0 ? "Select All" : "Unselect All" }}
      </label>
    </div>
    <div class="checkbox-container">
      <div v-if="filtered">
        <input
          type="text"
          placeholder="Filter...."
          class="footy-input"
          v-model="searchText"
        />
      </div>

      <div v-for="(option, index) in values" :key="index">
        <div class="checkbox-invisible">
          <input
            type="checkbox"
            class="checkbox-invisible-input"
            :id="index"
            :value="option.value"
            v-model="selected"
          />
          <label :for="index" class="checkbox-invisible-label">
            <!-- {{  option.text.length > 14 ? option.text.slice(0, 13) + "…" : option.text }} -->
            <h6>{{ truncate(option.text) }}</h6>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    label: String,
    filtered: Boolean,
    outcomes: Boolean
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
        // console.log(this.value);
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
  },
  mounted() {},
  methods: {
    truncate(value) {
      if (window.innerWidth <= 768) {
        return value.length > 30 ? value.slice(0, 29) + "…" : value;
      } else {
        return value;
      }
    },
    checkAll() {
      if (this.selected.length == 0) {
        let values = [];
        this.options.forEach(option => values.push(option.value));
        return this.selected = values;
        
      } else {
        return this.selected = [];
      }
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.footy-vertical-checkbox {
  .checkbox-container {
    border: 1px solid #d5ded5;
    border-radius: 12px;
    overflow: hidden;
    max-height: 514px;
    overflow-y: scroll;

    overflow: auto;
  }

  .checkbox-invisible-input {
    & + label {
      //width: 100%;
      margin-bottom: 0px;
      border-bottom: 1px solid #f0f1f0;
      display: flex;
      &.checked {
        background: transparent;
      }
    }
  }
  .footy-input {
    margin-bottom: 0px;
    border: none;
    border-bottom: 1px solid #f0f1f0;
    display: flex;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    padding-left: 16px;
    padding-top: 15px;
    padding-bottom: 12px;
    width: 100%;
  }
  input[type="radio"],
  input[type="checkbox"] {
    appearance: none;
    display: none;
  }
}
@media (max-width: $lg) {
  .checkbox-invisible-input {
    & + label {
      width: 100% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
  }
}
.vertical-radio-boxes {
  input[type="radio"],
  input[type="checkbox"] {
    appearance: none;
    display: none;
  }
}
</style>
