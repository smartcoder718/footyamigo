<template>
  <div class="centered" id="payment-page">
    <div ref="payment" i></div>
    <h3 class="text-center mb-2">Payment successful</h3>
    <p>
      <small style="font-weight: 400">Redirecting in {{ timer }} seconds</small>
    </p>
  </div>
</template>

<script>
import lottie from "lottie-web";
export default {
  data() {
    return {
      timer: 10
    };
  },
  mounted() {
    lottie.loadAnimation({
      container: this.$refs.payment, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,

      path: "/lottie/19231-payment-successful.json" // the path to the animation json
    });
    lottie.setSpeed(0.8);
    const state = this;
    const interval = setInterval(() => {
      state.timer -= 1;
      console.log(state.timer);
      if (state.timer == 1) {
        clearInterval(interval);
        window.location.replace("/dashboard");
      }
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
#payment-page {
  //max-width: 500px;
  flex-direction: column;
}
</style>
