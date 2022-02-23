import Vue from "vue";
import VCalendar from "v-calendar";

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: "v" // Use <vc-calendar /> instead of <v-calendar />
  // ...other defaults
});


import MediumEditor from "vuejs-medium-editor";
Vue.component("medium-editor", MediumEditor);
