<template>
  <div class="sort-item">
    <span class="sort-heading"> {{ title }} </span>
    <b-dropdown size="sm" class="footy-dropdown" no-caret>
      <template slot="button-content">
        {{ selectedSort }}
        <icon icon-name="keyboard_arrow_down" />
      </template>
      <b-dropdown-item
        v-for="(sort, i) in sortList"
        :key="i"
        @click="toggleSort(sort)"
      >
        {{ sort }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import Icon from "./Icon.vue"

export default {
  components: { Icon },
  props: {
    sortList: Array,
    selectedSort: String,
    title: String,
  },
  methods: {
    toggleSort(value) {
      this.$emit("toggleSort", value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>