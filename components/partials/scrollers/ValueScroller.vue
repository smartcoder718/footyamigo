<template>
  <div v-if="fixture.probability">
    <div v-for="option in probabilityOptions" :key="option.col">
      <div class="spaced">
        <h4>
          {{ option.title }}
        </h4>
        <h4 :class="'text-' + getVariant(getVal(option.col))">
          {{ getVal(option.col) }}%
        </h4>
      </div>
      <div class="mb-3">
        <b-progress
          :value="getVal(option.col)"
          :max="100"
          class="footy-progress"
          :variant="getVariant(getVal(option.col))"
        ></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import probabilityOptions from "~/components/json/probability-scroller.json";
export default {
  props: {
    fixture: Object
  },
  data() {
    return {
      probabilityOptions
    };
  },
  methods: {
    getVal(key) {
      return (this.fixture.probability[key] || "").toFixed(2);
    },
    getVariant(value) {
      if (value < 33) {
        return "danger";
      } else if (value < 66) {
        return "warning";
      } else {
        return "success";
      }
    }
  }
};
</script>

<style>
.spaced {
  display: flex;
  justify-content: space-between;
}
</style>
