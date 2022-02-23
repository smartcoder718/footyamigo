<template>
  <label class="footy-switch">
    <input type="checkbox" v-model="selected" />
    <span class="footy-switch-slider" :class="{ whitebg: whitebg }"></span>
  </label>
</template>

<script>
export default {
  props: {
    label: String,
    id: String,
    value: null,
    whitebg: Boolean,
  },

  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
        // console.log(value);
      },
    },
  },
};
</script>

<style lang="scss">
@import "~assets/scss/colors.scss";
.footy-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 24px;
  input {
    display: none;
  }
  margin: 0;
  .footy-switch-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $light;
    border-radius: 40px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    &.whitebg{
      background: #e9ecef;
    }
  }
  .footy-switch-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    background: #b4c2b4;
    border: 4px solid #fff;
    border-radius: 50%;
    left: 2px;
    bottom: 2px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  input:not(:checked) ~ .footy-switch-slider:before {
    box-shadow: 0px 2px 4px #eaf1ea;
  }
  input:checked ~ .footy-switch-slider:before {
    background: $primary;
  }
  input:checked + .footy-switch-slider {
    background: $primary;
  }
  input:checked + .footy-switch-slider:before {
    -webkit-transform: translateX(28px);
    -moz-transform: translateX(28px);
    transform: translateX(28px);
  }
}
</style>