<template>
  <div class="scroll-wrapper">
    <div class="scroll-buttons">
      <div>
        <button
          class="footy-scroll-button scroll-left shadow-sm mb-1"
          @click="$emit('scrollleft')"
        >
          <span class="material-icons"> west </span>
        </button>
      </div>
      <div>
        <button
          class="footy-scroll-button scroll-right shadow-sm mt-1"
          @click="$emit('scrollright')"
        >
          <span class="material-icons"> east </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.scroll-buttons {
  background: linear-gradient(
    269.38deg,
    #ffffff 0.62%,
    rgba(255, 255, 255, 0.9) 99.56%
  );
  padding: 5px;
}
.footy-scroll-button {
  background: #ffffff;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.07);
  color: #60685f;
  border-radius: 50%;
  border: 0;
  width: 40px;
  height: 40px;
  display: flex;
  span {
    font-size: 18px;
  }
  align-items: center;
  justify-content: center;
}
@media (max-width: $lg) {
  .scroll-buttons {
    display: none;
  }
}
</style>
