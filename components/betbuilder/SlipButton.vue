<template>
  <div class="slip-button" @click="toggleSelected" v-if="betsLength > 0">
    <div class="slip-content">
      <h3>Bet Slip</h3>
      <p>{{ coins }} Virtual Coins</p>
    </div>
    <h3 class="selected">{{ betsLength }} Selected</h3>
  </div>
</template>

<script>
export default {
  props: {
    coins: Number,
    betsLength: Number
  },
  methods: {
    toggleSelected() {
      this.$emit("toggleSelected");
    }
  }
};
</script>

<style lang="scss" scoped></style>
