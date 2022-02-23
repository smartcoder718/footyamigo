<template>
  <div>
    <h3 class="text-center">
      {{ label }} <span class="text"> Between </span>
      <span class="text-primary ml-2"> {{ rangeText }} </span>
    </h3>

    <vue-slider
      v-model="range"
      :enable-cross="false"
      :min="min"
      :dotSize="36"
      :contained="true"
      :height="32"
      :max="max"
      :dotOptions="dotOptions"
      railStyle="border: 1px solid #D5DED5; background:white;"
      :interval="step"
      :process="process"
    ></vue-slider>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Array, default: () => [0, 100] },
    step: { type: Number, default: 1 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    label: { type: String, default: "" }
  },
  mounted() {},
  data() {
    return {
      //range: [0, 3],
      process: dotsPos => [
        [dotsPos[0], dotsPos[1], { border: "4px solid white" }]
      ],
      dotOptions: {
        style: {
          background: "#60B15A",
          border: "1px solid #D5DED5",
          boxShadow: "inset 0 0 0 10px white, 0px 6px 15px rgba(0, 0, 0, 0.1)"
        }
      }
    };
  },
  computed: {
    rangeText() {
      return this.value.join(" to ");
    },
    range: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>
