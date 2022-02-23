<template>
  <div class="odds-row">
    <div class="item" v-for="odd in odds" :key="odd.key" >
      <span class="key"> {{ odd.label }} </span>
      <span class="value" @click="addOdd(odd)"> {{ odd.value }} </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    odds: Object,
    title: String,
  },
  methods: {
    addOdd(odd) {
      this.$emit("addOdd", {
        ...odd,
        title: this.title,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>