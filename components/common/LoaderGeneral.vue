<template>
  <div>
    <div class="centered">
      <div ref="loader" class="max-width: 60%;"></div>
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

      path: "/lottie/loader-general.json", // the path to the animation json
    });
    lottie.setSpeed(0.8)
  }
};
</script>

<style>
</style>