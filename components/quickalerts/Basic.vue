<template>
  <div>
    <b-row no-gutters class="mb-3">
      <b-col md="6" class="mb-2 mb-md-0">
        <footy-dropdown-select
          :options="alertTypes"
          v-model="form.type"
          label="Type"
          class="mr-md-1 mr-0"
        ></footy-dropdown-select>
      </b-col>
      <b-col md="6">
        <footy-dropdown-select
          :options="resultOptions"
          v-model="form.result"
          label="Is"
          v-if="form.type == 'result'"
          class="ml-md-1 ml-0"
        ></footy-dropdown-select>
        <footy-dropdown-select
          :options="equationOptions"
          v-model="form.equation"
          label="Is"
          v-else
          class="ml-1"
        ></footy-dropdown-select>
      </b-col>
    </b-row>
    <div>
      <footy-radio
        :options="comparatorValues"
        v-model="form.value"
        id="value"
        v-if="comparatorValues.length"
      >
        <template v-slot:form-radio>
          <b-form-radio
            :value="
              !getValues(comparatorValues).includes(form.value) ? form.value : 0
            "
            class="custom-radio-slot"
          >
            <b-form-input
              v-if="getValues(comparatorValues).includes(form.value)"
              placeholder="Custom"
              type="number"
            ></b-form-input>
            <b-form-input
              v-else
              v-model.number="form.value"
              type="number"
            ></b-form-input>
          </b-form-radio>
        </template>
      </footy-radio>
      <hr />
      <footy-radio
        :options="minuteComparisonOptions"
        v-model="form.minute_equation"
        id="minuteComparison"
      >
      </footy-radio>

      <footy-radio
        :options="timerOptions"
        v-model="form.minute"
        id="minute"
        customInput
      >
        <template v-slot:form-radio>
          <b-form-radio
            :value="
              !getValues(timerOptions).includes(form.minute) ? form.minute : 0
            "
            class="custom-radio-slot"
          >
            <b-form-input
              v-if="getValues(timerOptions).includes(form.minute)"
              placeholder="Custom"
              type="number"
            ></b-form-input>
            <b-form-input
              v-else
              v-model.number="form.minute"
              type="number"
            ></b-form-input>
          </b-form-radio>
        </template>
      </footy-radio>

      <div class="d-flex align-items-center my-4">
        <label class="mb-0 mr-3 add-note">Add Note</label>
        <footy-switch
          v-model="showNote"
          :whitebg="true"
          name="check-button"
          switch
        >
        </footy-switch>
      </div>

      <footy-input v-if="showNote" v-model="form.note"> </footy-input>
      <b-button
        text="Save Alert"
        variant="primary"
        block="true"
        icon="notifications"
        @click="createQuickAlert"
        :disabled="disabledButton"
      >
        <span class="d-inline-block" style="transform: translateY(3px)"
          >Save Alert</span
        >
      </b-button>
      <!-- {{ form }} -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixture_id: Number,
    liveMode: Boolean,
  },
  name: "Basic",
  data() {
    return {
      alertTypes: [
        { text: "Result", value: "result" },
        { text: "Goals", value: "goals" },
        { text: "Cards", value: "cards" },
        { text: "Corners", value: "corners" },
        //{ text: "In-Play Update", value: "update" }
      ],
      showNote: false,
      disabledButton: false,
      timerOptions: [
        { text: "5 Mins", value: 5 },
        { text: "20 Mins", value: 20 },
        { text: "35 Mins", value: 35 },
        { text: "60 Mins", value: 60 },
        { text: "70 Mins", value: 70 },
      ],
      minuteComparisonOptions: [
        { text: "Before", value: "before" },
        { text: "After", value: "after" },
      ],
      equationOptions: [
        { value: "=", text: "Exactly" },
        { value: ">", text: "More than" },
        { value: "<", text: "Less than" },
      ],
      resultOptions: [
        { value: "home_win", text: "Home Win (1)" },
        { value: "draw", text: "Draw (X)" },
        { value: "away_win", text: "Away Win (2)" },
        { value: "home_draw", text: "Home Win or Draw (1X)" },
        { value: "away_draw", text: "Draw or Away Win (X2)" },
        { value: "not_draw", text: "Home or Away Win (12)" },
      ],
      form: {
        type: "result",
        result: "home_win",
        minute: 70,
        minute_equation: "before",
        note: "",
        equation: ">",
        value: 1,
        fixture_id: this.fixture_id,
      },
    };
  },
  methods: {
    getValues(items) {
      return items.map((i) => i.value);
    },
    async createQuickAlert() {
      // const quick_alert = await this.$axios.$post(
      //   "/user/quickalerts/create",
      //   this.form
      // );
      // console.log(quick_alert);
      // alert()
      console.log(this.form);
      // return quick_alert;
    },
  },
  computed: {
    comparatorValues() {
      if (this.form.type == "goals") {
        return [
          { value: 1, text: "1 Goals" },
          { value: 2, text: "2 Goals" },
          { value: 3, text: "3 Goals" },
          { value: 4, text: "4 Goals" },
          { value: 5, text: "5 Goals" },
        ];
      } else if (this.form.type == "cards") {
        return [
          { value: 1, text: "1 Cards" },
          { value: 2, text: "2 Cards" },
          { value: 3, text: "3 Cards" },
          { value: 4, text: "4 Cards" },
          { value: 5, text: "5 Cards" },
        ];
      } else if (this.form.type == "corners") {
        return [
          { value: 1, text: "1+ Corners" },
          { value: 2, text: "2+ Corners" },
          { value: 3, text: "3+ Corners" },
          { value: 4, text: "4+ Corners" },
          { value: 5, text: "5+ Corners" },
        ];
      } else {
        return [];
      }
    },
  },
  watch: {
    "form.note": function (val) {
      if (val == "") {
        this.disabledButton = true;
      } else {
        this.disabledButton = false;
      }
    },
    showNote(val) {
      if (val && this.form.note == "") {
        this.disabledButton = true;
      }
      else {
        this.disabledButton = false;
      }
    },
  },
};
</script>

<style lang="scss">
.custom-radio-slot {
  input {
    border: none;
  }
}
.add-note {
  // font-family: "Poppins"; //REPLACEDTEMPORARILY //REPLACED
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height */

  display: flex;
  align-items: center;

  
}
</style>
