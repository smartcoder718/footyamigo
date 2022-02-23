<template>
  <div class="d-flex justify-content-center w-100 h-100 mt-5" >
    <Sharer :id="$route.params.id" :hideURL="true"/>
  </div>
</template>

<script>
import Sharer from "~/components/Sharer";
export default {
  components: {
    Sharer
  },
  methods: {}
};
</script>

<style></style>
