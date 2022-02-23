<template>
  <div>
    <b-form class="add-streak-form">
      <label for="form-market footy-label">Market</label>
      <footy-select v-model="form.market" :options="streakOptions">
      </footy-select>
      <label for="form-title footy-label">Title</label>
      <b-input v-model="form.title" id="form-title" class="footy-input">
      </b-input>
      <label for="form-subtitle footy-label">Subtitle</label>
      <b-input v-model="form.subtitle" id="form-subtitle" class="footy-input">
      </b-input>
      <label for="form-header footy-label">Header</label>
      <b-input v-model="form.header" id="form-header" class="footy-input">
      </b-input>
      <label for="form-description footy-label">Description</label>
      <vue-editor v-model="form.description" id="form-description">
      </vue-editor>
    </b-form>
    <b-row>
      <b-col>
        <b-button
          class="mt-3 footy-button"
          variant="secondary"
          block
          to="/admin/streaks/"
          >Cancel</b-button
        >
      </b-col>
      <b-col>
        <b-button
          class="mt-3 footy-button"
          variant="success"
          block
          @click="$emit('updateStreak')"
          >Save</b-button
        >
      </b-col>
    </b-row>
  </div>
</template>

<script>
import streakOptions from "~/components/json/streak-options.json";
import FootyDropdownSelect from "../common/FootyDropdownSelect.vue";
import FootySelect from "../common/FootySelect.vue";
export default {
  components: { FootySelect },
  props: {
    value: null,
  },
  data() {
    return {
      streakOptions,
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
