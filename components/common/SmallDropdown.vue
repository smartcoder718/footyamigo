<template>
  <b-dropdown size="sm" class="footy-dropdown" no-caret>
    <template slot="button-content">
      {{ label }}:

      <span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1L5 5L1 1"
            stroke="#222622"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </template>
    <b-dropdown-item
      v-for="(option, i) in options"
      :key="i"
      @click="toggleOption(option)"
    >
      {{ option.text }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    label: String,
    options: Array,
    value: null
  },
  data() {
    return {};
  },
  methods: {
    toggleOption(option) {
      this.selected = option.value;
    }
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style></style>
