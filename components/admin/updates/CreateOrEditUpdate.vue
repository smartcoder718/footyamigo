<template>
  <div class="d-grid gap-20" style="max-width:600px; margin:auto;">
    <div>
      <label class="footy-label">Title</label>
      <b-input
        class="footy-input"
        v-model="form.title"
        placeholder="Example - Fixtures Page"
      >
      </b-input>
    </div>
    <div>
      <label class="footy-label">Version</label>
      <b-input
        type="number"
        class="footy-input"
        v-model="form.version"
        placeholder="Example: 1.01"
      >
      </b-input>
    </div>
    <client-only>
      <v-date-picker
        v-model="form.datetime"
        class="filter-button"
        color="green"
        mode="dateTime"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <b-button
            variant="light"
            style="min-width:100px; font-size: 15px;"
            :value="inputValue"
            v-on="inputEvents"
            class="centered"
          >
            <DateIcon class="mr-2" />
            <span class="text-grey">
              {{ $moment(form.datetime).local().format("lll") }}</span
            >
          </b-button>
        </template>
      </v-date-picker>
    </client-only>
    <div>
      <label class="footy-label">Completed</label>
      <footy-switch v-model="form.completed"> </footy-switch>
    </div>
    <div>
      <label class="footy-label">Content</label>
      <!-- <b-input
      class="footy-input"
      v-model="form.content"
      placeholder="Example - HIT RATE"
    >
    </b-input> -->
      <vue-editor id="editor" v-model="form.content"> </vue-editor>
    </div>
    <b-button class="footy-button" @click="createOrEditUpdate">
      {{ form.id ? "Update" : "Create" }}
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    value: null
  },
  data() {
    return {
      options: {}
    };
  },
  components: {},
  methods: {
    async createOrEditUpdate() {
      if (this.form.id) {
        await this.$axios.post("/admin/updates/edit", this.form);
      } else {
        await this.$axios.post("/admin/updates/create", this.form);
      }
      this.$router.push("/admin/updates");
    }
  },
  computed: {
    form: {
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
