<template>
  <b-button-group>
    <template v-if="typeof value == 'string'">
      <b-button
        v-for="option in options"
        :key="option"
        :variant="selected == option ? 'primary' : 'white'"
        @click="selected = option"
        ><small>{{ option }}</small></b-button
      >
    </template>
    <template v-else>
      <b-button
        v-for="option in options"
        :key="option.value"
        :variant="selected.value == option.value ? 'primary' : 'white'"
        @click="selected = option"
        ><small>{{ option.text }}</small></b-button
      >
    </template>
  </b-button-group>
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
    value: [String, Object],
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

