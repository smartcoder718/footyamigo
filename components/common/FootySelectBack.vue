<template>
  <b-form-group :label="label" :label-for="id" class="footy-select">
    <div class="footy-select">
      <b-form-select
        v-model="selected"
        :options="options"
        :name="name"
      ></b-form-select>
    </div>
  </b-form-group>
</template>

<script>
export default {
  props: {
    label: String,
    name: String,
    id: String,
    type: {
      type: String,
      default: "text"
    },
    options: Array,
    value: String
  },
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
.footy-select {
  select {
    font-weight: bold !important; //COLFAX
    font-size: 16px;
    line-height: 24px;
    /* identical to box height */
    height: 56px;
    color: $dark-1;
    background: #ffffff;
    border: 1px solid #d5ded5;
    box-sizing: border-box;
    border-radius: 12px;
  }
}
</style>
