<template>
  <div class="d-grid grid-gap-10">
    <template v-if="category != 'probability'">
      <footy-radio
        :options="teams"
        v-model="setting.team"
        name="teams"
        type="select"
        label="Team"
      />
      <footy-radio
        type="select"
        :options="locations"
        v-model="setting.location"
        name="locations"
        label="Form"
      />
    </template>

    <footy-radio
      type="select"
      label="Comparator"
      name="comparators"
      :options="comparators"
      v-model="setting.comparator"
    />

    <FormulateInput
      label="Value"
      name="value"
      type="number"
      class="mb-3"
      v-model="setting.value"
    />
  </div>
</template>

<script>
import FootyRadio from "../../common/FootyRadio.vue";
export default {
  components: { FootyRadio },
  props: {
    value: Object,
    teams: Array,
    locations: Array,
    comparators: Array
  },

  computed: {
    setting: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    category() {
      if (!this.$store.getters.lookupPreMatchRules) {
        return;
      }
      const rule = this.$store.getters.lookupPreMatchRules[this.setting.rule_id];
      if (rule) {
        return rule.category;
      } else {
        return null;
      }
    }
  }
};
</script>

<style></style>
