<template>
  <b-form>
    <b-form-group v-for="(schema, name) in schemas" :key="name">
      <label v-if="schema.customLabel">{{ schema.customLabel }}</label>
      <component :is="schema.component" v-model="form[name]" v-bind="schema">
      </component>
    </b-form-group>


  </b-form>
  
</template>

<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {
      schemas: {
        title: {
          type: "text",
          name: "title",
          customLabel: "Title",
          placeholder: "Under X Play System",
          class: "footy-input",
          component: "b-input"
        },
        description: {
          name: "description",
          customLabel: "Description",
          placeholder: "Description under title",
          component: "b-textarea",
          class: "footy-textarea"
        },
        roi: {
          type: "number",
          name: "roi",
          customLabel: "ROI %",
          placeholder: "Return on investment %",
          class: "footy-input",
          component: "b-input"
        },

        video_description: {
          name: "video_description",
          customLabel: "Video description",
          placeholder: "Description under video",
          component: "b-textarea",
          class: "footy-textarea",
          rows: 4
        },
        learn: {
          name: "learn",
          customLabel: "Learn",
          placeholder: "What will user learn?",
          component: "b-textarea",
          class: "footy-textarea",
          rows: 3
        },
        video_embed: {
          type: "text",
          name: "video",
          customLabel: "Video Embed",
          placeholder: "",
          rows: 5,
          class: "footy-textarea",
          component: "b-textarea"
        },
        presets: {
          options: [],
          name: "presets",
          label: "Presets",

          rows: 5,
          component: "footy-vertical-checkbox"
        }
      }
    };
  },
  computed: {
    form: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  mounted() {
    this.getPresets();
  },
  methods: {
    async getPresets() {
      const presets = await this.$axios.$get("/admin/presets/active");
      this.schemas.presets.options = presets.map(preset => {
        return {
          text: preset.title,
          value: preset.id
        };
      });
      console.log(presets);
    }
  }
};
</script>

<style></style>
