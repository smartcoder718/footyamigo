<template>
  <CodeInput :loading="false" class="otp-input" v-on:change="onChange"  />
</template>

<script>
import CodeInput from "vue-verification-code-input";
export default {
  components: {
    CodeInput
  },
  props: {
    value: null
  },
  methods: {
    onChange(val) {
      this.val = val;
    }
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.otp-input {
  input {
    border: 2px solid $primary !important;
    border-radius: 8px !important;
    height: 100% !important;
width: 30% !important;
    flex: 1;
    font-size: 30px !important;
  }

  * {
    font-family: "Poppins" !important;
  }
  .react-code-input {
    display: flex;
    column-gap: 12px;
    justify-content: center;
    width: 100% !important;
   
  }
  width: 100% !important;
}
</style>
