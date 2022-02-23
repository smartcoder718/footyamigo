<template>
  <div class="rules-wrapper">
    <div class="rules-name">
      <h3>Why {{ selectedMarket.title }}?</h3>
    </div>

    <hr />

    <div class="rules-container">
      <div
        class="rule mb-1 d-flex align-items-center justify-content-between"
        v-for="(rule, i) in selectedMarket.rules"
        :key="i"
      >
        <div class="rule-details">
          <h3 class="title">{{ rule[0] }}</h3>
          <p class="subtitle">{{ rule[2] }}</p>
        </div>
        <h3 class="rule-value">{{ rule[1] }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedMarket: Object
  }
};
</script>

<style lang="scss" scoped></style>
