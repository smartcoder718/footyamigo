<template>
  <div>
    <div class="centered">
      <div ref="loader" class="max-width: 80%;"></div>
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
      loop: false,
      autoplay: true,
     
      path: "/lottie/74877-success.json" // the path to the animation json
    });
    lottie.setSpeed(1);
  }
};
</script>

<style></style>
