<template>
  <b-form-group :label-for="id" class="mb-0">
    <label v-if="label" class="footy-label"
      >{{ label }}
      <span v-if="info">
        <InfoIcon class="icon-right" :id="id + '-info'"> </InfoIcon>
        <b-popover
          :target="id + '-info'"
          variant="grey"
          triggers="hover"
          placement="topright"
        >
          {{ info }}
        </b-popover>
      </span>
    </label>
    <b-form-input
      class="footy-input"
      :placeholder="placeholder"
      :id="id"
      v-model="val"
      v-bind="{ ...$attrs, ...$props }"
      :type="type"
    ></b-form-input>
  </b-form-group>
</template>

<script>
export default {
  props: {
    label: String,
    id: String,
    type: {
      type: String,
      default: "text"
    },
    info: String,
    placeholder: String,
    value: null
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
.footy-input {
  & {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height */
    height: 56px;
    color: $dark-1;
    background: #ffffff;
    border: 1px solid #d5ded5;
    box-sizing: border-box;
    border-radius: 12px;
  }
  &.form-control-sm {
    height: 44px;
  }
}
</style>
