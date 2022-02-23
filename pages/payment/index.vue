<template> </template>

<script>
export default {
  mounted() {
    console.log(this.$route);
    switch (this.$route.query.status) {
      case "failed":
      case "cancelled":
        this.$router.push("/payment/failed");
        break;
      default:
        this.$router.push("/payment/success");
    }

    // case "successful":
    //       case "success":
    //     if (
    //       this.$route.query.status == "successful" ||
    //       this.$route.query.status == "success"
    //     ) {
    //       this.$router.push("/payment/success");
    //     } else if (
    //       this.$route.query.status == "failed" ||
    //       this.$route.query.status == "cancelled"
    //     ) {
    //       this.$router.push("/payment/failed");
    //     } else {
    //       setTimeout(() => {
    //         window.location.replace("/dashboard");
    //       }, 1000);
    //     }
  }
};
</script>

<style></style>
