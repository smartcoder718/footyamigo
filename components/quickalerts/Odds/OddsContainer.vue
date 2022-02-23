<template>
  <div>
    <div
      class="odds-group"
      :class="[mainOdd.options ? 'grid' : 'basic']"
      v-for="(mainOdd, i) in filteredOdds"
      :key="i"
    >
      <div class="odds-title">
        <h3>{{ mainOdd.name }}</h3>
        <div class="d-flex align-items-center my-1" v-if="mainOdd.split">
          <label class="mb-0 mr-3 add-note">Split </label>
          <footy-switch
            v-model="mainOdd.split_selected"
            :whitebg="true"
            name="check-button"
            switch
          >
          </footy-switch>
        </div>
      </div>

      <!-- Case 1 Grid Row -->
      <div v-if="mainOdd.options">
        <!-- Grid Header Row -->
        <div class="odds-row">
          <div class="item">
            <span class="key">Value</span>
          </div>
          <div class="item">
            <span class="key">over</span>
          </div>
          <div class="item">
            <span class="key">under</span>
          </div>
        </div>
        <!-- Grid Header Row -->
        <template v-if="mainOdd.split_selected">
          <grid-odd
            v-for="odd in mainOdd.split"
            @addOdd="addOdd"
            :key="odd.name"
            :odd="odd"
            :title="mainOdd.name"
          >
          </grid-odd>
        </template>

        <template v-else>
          <grid-odd
            v-for="odd in mainOdd.options"
            @addOdd="addOdd"
            :key="odd.name"
            :odd="odd"
            :title="mainOdd.name"
          >
          </grid-odd>
        </template>
      </div>

      <!-- Case 2 -> Basic Row -->
      <basic-odd v-else @addOdd="addOdd" :title="mainOdd.name" :odds="mainOdd.odds"></basic-odd>
    </div>
  </div>
</template>

<script>
import BasicOdd from "./BasicOdd.vue";
import GridOdd from "./GridOdd.vue";

export default {
  props: {
    filteredOdds: Array,
  },
  components: {
    BasicOdd,
    GridOdd,
  },
  methods: {
    addOdd(odd) {
      this.$emit("addOdd", odd);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>