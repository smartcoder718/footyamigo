<template>
  <div>
    
  </div>
</template>

<script>
export default {
  middleware: "auth",

  mounted() {
    this.$router.push("/auth/login");
  }
};
</script>

<style></style>
