<template>
  <div>
    <footy-tab-select
      id="basic"
      :options="submenuOptions"
      v-model="submenu"
      @input="getValue"
      size="sm"
    >
    </footy-tab-select>
    <div>
      <component
        v-bind:is="submenu"
        :fixture="fixture"
        :liveMode="liveMode"
        v-bind="selected"
        @addOdd="addOdd"
      ></component>
      <!-- <Basic :fixture_id="fixture.fixture_id"></Basic> -->
    </div>
  </div>
</template>

<script>
import Basic from "~/components/quickalerts/Basic.vue";
import Odds from "~/components/quickalerts/Odds.vue";
import Availability from "~/components/quickalerts/Availability.vue";

export default {
  props: {
    fixture: Object,
    liveMode: Boolean,
  },
  data() {
    return {
      submenuOptions: ["Basic", "Odds", "Availability", "Presets"],
      submenu: "Basic",
    };
  },
  computed: {
    selected() {
      if (this.submenu == "Odds") {
        return this.fixture;
      }
    },
  },
  components: {
    Basic,
    Odds,
    Availability,
  },
  methods: {
    getValue(val) {
      // console.log(val);
      this.submenu = val;
    },
    addOdd(odd) {
      console.log(odd);
      this.$emit("addOdd", odd);
    },
  },
};
</script>
