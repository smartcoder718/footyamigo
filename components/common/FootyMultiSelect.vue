<template>
  <div>
    <b-form-group :label="label" v-slot="{ id }" class="footy-multi-select">
      <b-form-checkbox-group
        :id="id"
        v-model="selected"
        :options="options"
        :aria-describedby="id"
        :name="name"

        stacked
      ></b-form-checkbox-group>
    </b-form-group>
  </div>
</template>

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
    options: Array,
    value: Array,
  },

  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.footy-multi-select {
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 12px;
  overflow: hidden;
  max-height: 428px;
  overflow-y: scroll;
  padding: 12px;
}
</style>