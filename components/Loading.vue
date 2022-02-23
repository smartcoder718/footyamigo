<template>
  <div>
    <div style=" margin-top:30px; display:flex; align-items:center; justify-content:center">
      <div ref="loading"></div>
    </div>
    
  </div>
</template>

<script>
import lottie from "lottie-web";
export default {
  mounted() {
    lottie.loadAnimation({
      container: this.$refs.loading, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,

      path: "/loading.json", // the path to the animation json
    });
    lottie.setSpeed(0.8)
  }
};
</script>

<style>
</style>