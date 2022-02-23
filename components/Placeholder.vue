<template>
  <div>
    <div style="max-width: 100%;">
      <div ref="loader"></div>
    </div>
    
  </div>
</template>

<script>
import lottie from "lottie-web";
export default {
  mounted() {
    lottie.loadAnimation({
      container: this.$refs.loader, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,

      path: "lottie/80367-placeholder4.json", // the path to the animation json
    });
    lottie.setSpeed(0.8)
  }
};
</script>

<style>
</style>