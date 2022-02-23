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
      loop: false,
      autoplay: false,
      rendererSettings: {
        //ly svg renderer, hides elements when opacity reaches 0 (defaults to true)
        className: "sent-email-lottie",
        id: "some-id",
        width: "100%",
        height: "100%"
      },

      path: "/lottie/71681-sent-email.json" // the path to the animation json
    });
    lottie.setSpeed(0.6);
    setTimeout(() => {
      lottie.play();
    }, 500);
  }
};
</script>

<style>
.sent-email-lottie {
  width: 300px !important;
  height: 300px;
}</style>
