<template>
  <div>
    <div v-for="(rule, index) in items" :key="index" class="mb-3">
      <h6
        class="text-grey my-2 d-flex align-items-center"
        style="justify-content: space-between"
      >
        Rule: {{ index + 1 }}
        <div class="d-flex ">
          <b-button
            variant="white"
            size="sm"
            @click="items.splice(index, 1)"
            class="p-1"
          >
            <span
              class="material-icons-outlined text-danger"
              style="font-size:18px;"
            >
              delete_forever
            </span>
          </b-button>
          <b-button
            variant="white"
            size="sm"
            class="p-1"
            @click="$emit('edit', index, type)"
          >
            <span
              class="material-icons-outlined text-grey"
              style="font-size:18px;"
            >
              edit
            </span>
          </b-button>
        </div>
      </h6>
      <div class="d-flex">
        <div
          v-html="makePreview(rule)"
          class=" flex-1"
          style="font-size:14px;"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
    rules: Object,
    type: String,
    locations: Array,
    comparators: Array,
    teams: Array
  },
  methods: {
    removeZeros(value) {
      if (`${value}`.endsWith(".00")) {
        return parseInt(value);
      }
      return value;
    },
    makePreview({ location, team, rule_id, value, comparator }) {
      const rules = this.rules;
      if (rules[rule_id].category == "probability") {
        return `<span class=" text-capitalize">${rules[rule_id].category}: ${
          rules[rule_id].label
        }</span>
          is
          <span class="text-primary">${this.comparatorsLabel[comparator]}</span>
          ${this.removeZeros(value)} `;
      }
      return `<span class="">${this.teamsLabel[team]} ${
        rules[rule_id].label
      }</span>
      [${this.locationsLabel[location]}]
      is
      <span class="text-primary">${this.comparatorsLabel[comparator]}</span>
      ${this.removeZeros(value)} `;
    },
    toObject(array) {
      return Object.assign(
        {},
        ...array.map(item => ({ [item.value]: item.text }))
      );
    }
  },

  computed: {
    locationsLabel() {
      return this.toObject(this.locations);
    },
    comparatorsLabel() {
      return this.toObject(this.comparators);
    },
    teamsLabel() {
      return this.toObject(this.teams);
    },
    items: {
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

<style></style>
