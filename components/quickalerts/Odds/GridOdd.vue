<template>
  <div class="odds-row">
    <div class="item">
      <span class="key"> {{ odd.name }} </span>
    </div>
    <div
      class="item"
      v-for="subOdd in odd.odds"
      :key="subOdd.key"
      @click="addOdd(subOdd)"
    >
      <span class="value">
        {{ !subOdd.value ? "Add" : subOdd.value }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // key: String,
    odd: Object,
    title: String
  },
  methods: {
    addOdd(odd) {
      this.$emit("addOdd", {
        ...odd,
        title: this.title
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>