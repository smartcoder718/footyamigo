<template>
  <b-button
    class="footy-button"
    :disabled="disabled"
    v-bind="{ ...$props }"
    :variant="variant"
  >
    <span class="material-icons-outlined mr-2" v-if="icon != null">
      {{ icon }}
    </span>
    <slot> </slot>
  </b-button>
</template>

<script>
export default {
  props: ["text", "icon", "variant", "href", "to", "block", "disabled"],
};
</script>

<style>
</style>