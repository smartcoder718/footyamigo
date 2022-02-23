<template>
  <FixturePage :pageTitle="pageTitle" :pageDescription="pageDescription">

  </FixturePage>
</template>

<script>
import FixturePage from "../FixturePage";

export default {
  props: {
    pageTitle: String,
    pageDescription: String,
  },
  data() {
    return {
      
    };
  },

};
</script>

<style lang="scss">
@use "sass:map";
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";
</style>
