<template>
  <div class="footy-checkbox">
    <div class="checkbox-container">

      <div v-for="(option, index) in options" :key="index">
        <div class="checkbox-invisible">
          <input
            type="checkbox"
            class="checkbox-invisible-input"
            :id="option.value.split(' ').join('-')"
            :value="option.value"
            v-model="selected"
            name="id"
          />
          <label
            :for="option.value.split(' ').join('-')"
            class="checkbox-invisible-label"
            :class="selected.includes(option.id) ? 'checked' : ''"
            >{{ option.value }}</label
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.footy-checkbox {
  .checkbox-container {
    display: flex;
  }
  .checkbox-invisible {
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .checkbox-invisible-label {
    border: 2px solid #cfd8cf;
    border-radius: 12px;
    &.checked {
      border: 2px solid #60b15a;
    }
  }
}
</style>
<script>
export default {
  props: {
    label: String,
    name: String,
    id: String,
    type: {
      type: String,
      default: "text",
    },
    options: { type: Array, default: [] },
    value: null,
  },
  methods: {
    getVal(option) {
      if (typeof option == "object") {
        console.log('True');
        return option.id;
      } else {
        return option;
      }
    },
    setVal(option) {
      this.selected = this.getVal(option);
    },
    getVariant(option) {
      return this.getVal(option) == this.selected
        ? "active-checkbox text-success"
        : "";
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
  mounted(){
    // console.log(this.options);
  }
};
</script>

