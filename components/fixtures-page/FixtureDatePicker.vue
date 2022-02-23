<template>
  <client-only>
    <v-date-picker
      v-model="selected_date"
      class="filter-button "
      :min-date="minDate"
      :max-date="maxDate"
      color="green"
    >
      <template v-slot="{ inputValue, inputEvents }">
        <b-button
          variant="light"
          style="min-width:100px; font-size: 15px;"
          :value="inputValue"
          v-on="inputEvents"
          class="centered dropdown-toggle-no-caret"
        >
          <DateIcon class="mr-2" />
          <span class="text-grey"> {{ buttonText }} </span>
        </b-button>
      </template>
    </v-date-picker>
  </client-only>
</template>

<script>
export default {
  props: {
    value: Date,
    buttonText: { type: String, default: "Date" },
    maxDate: {
      type: Date,
      default: () => new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    },
    minDate: {
      type: Date,
      default: () => new Date("2021-01-01")
    }
  },
  computed: {
    selected_date: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },

  data() {
    return {};
  }
};
</script>

<style></style>
