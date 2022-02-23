<template>
  <b-form>
    <b-form-group v-for="(schema, name) in schemas" :key="name">
      <label class="mb-2">{{ schema.title }}</label>
      <component :is="schema.component" v-model="form[name]" v-bind="schema">
      </component>
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  props: {
    value: Object,
  },
  data() {
    return {
      schemas: {
        title: {
          type: "text",
          name: "title",
          title: "Title",
          placeholder: "Short Title",
          class: "footy-input",
          component: "b-input",
        },
        video_url: {
          type: "text",
          name: "video_url",
          title: "Video URL",
          placeholder: "https://",
          class: "footy-input",
          component: "b-input",
        },
        location: {
          name: "location",
          title: "Page Location",
          placeholder: "Example Betting Systems Page",
          options: [
            { value: "pre-match-alerts", text: "PreMatch Strategy List" },
            { value: "in-play-alerts", text: "InPlay Strategy List" },
            { value: "betting-systems", text: "Betting Systems" },
            { value: "bet-builders", text: "Bet Builders" },
            { value: "fixtures", text: "Fixtures" },
            { value: "dashboard", text: "Dashboard" },
            { value: "streaks", text: "Streaks" },
            { value: "filters", text: "Filters" },
            { value: "help", text: "Help" },
          ],
          component: "footy-vertical-radio",
        },
      },
    };
  },
  computed: {
    form: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style></style>
