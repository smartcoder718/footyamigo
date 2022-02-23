<template>
  <b-row>
    <b-col cols="12">
      <b-button
        class="footy-button float-right"
        variant="primary"
        @click="createBetBuilder"
      >
        Save Betbuilder Strategy</b-button
      >
    </b-col>
    <b-col md="8">
      <b-card no-body class="shadow-sm border-0 ">
        <b-tabs pills card v-model="activeTabIndex">
          <b-tab title="Add Rules" title-link-class="footy-button">
            <div class="d-flex flex-col row-gap-10">
              <div class="d-grid grid-col-1 grid-col-md-2 grid-gap-10">
                <FormulateInput
                  type="text"
                  label="Title"
                  name="title"
                  v-model="form.title"
                  placeholder="Example: Home Win"
                  validation="required|not:strawberry,banana"
                />
                <FormulateInput
                  type="select"
                  label="Outcome"
                  name="outcomes"
                  :options="outcomes"
                  v-model="form.outcome"
                />
              </div>
              <div class="d-grid grid-col-1 grid-col-md-2 grid-gap-10">
                <FormulateInput
                  type="select"
                  style="flex:1"
                  label="Category"
                  name="category"
                  :options="categories"
                  v-model="setting.category"
                />
                <FormulateInput
                  type="select"
                  label="Rule"
                  name="rule"
                  style="flex:1"
                  :options="rulesInCategory"
                  v-model="setting.rule_id"
                />
              </div>
              <BetBuilderEditor
                v-model="setting"
                :teams="teams"
                :locations="locations"
                :comparators="comparators"
              />
              <b-button class="footy-button" @click="addRule" variant="primary">
                Add rule
              </b-button>
            </div>
          </b-tab>
          <!-- <b-tab title="Outcome" title-link-class="footy-button">
           <footy-vertical-radio
              v-model="form.outcome"
              :options="outcomes"
              v-if="outcomes"
              id="outcomes"
              class="vertical-radio-boxes"
            >
            </footy-vertical-radio>
          </b-tab> -->

          <b-tab title="Leagues" title-link-class="footy-button">
            <footy-vertical-checkbox
              v-model="form.leagues"
              :options="$store.state.leagues"
              name="leagues"
              id="leagues"
              label="Select Leagues"
              filtered
              outcomes
            ></footy-vertical-checkbox>
          </b-tab>
        </b-tabs>
        <b-modal v-model="show_edit" size="lg" body-class="overflow-hidden">
 
          <BetBuilderEditor
            v-if="edit_mode == 'probabilities'"
            v-model="form.probabilities[edit_index]"
            :teams="teams"
            :locations="locations"
            :comparators="comparators"
          />
          <BetBuilderEditor
            v-else-if="edit_mode == 'rules'"
            v-model="form.rules[edit_index]"
            :teams="teams"
            :locations="locations"
            :comparators="comparators"
          />
        </b-modal>
      </b-card>
    </b-col>

    <b-col md="4">
      <b-card
        class="shadow-sm border-0 h-100"
        v-if="rules"
        style="max-height: 600px; overflow: auto;"
      >
        <b-card-title>
          <h3>Rules Preview</h3>
        </b-card-title>
        <b-card-body>
          <div v-for="type in rule_types" :key="type">
            <h4 class="text-uppercase " v-if="form[type].length">{{ type }}</h4>
            <BetBuilderPreview
              v-model="form[type]"
              :type="type"
              class="mb-4"
              :teams="teams"
              :rules="rules"
              :locations="locations"
              :comparators="comparators"
              @edit="editRule"
            >
            </BetBuilderPreview>
          </div>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import BetBuilderEditor from "./BetBuilderEditor.vue";
import BetBuilderPreview from "./BetBuilderPreview.vue";
export default {
  layout: "admin",
  props: {
    value: Object
  },
  data() {
    return {
      activeTabIndex: 0,
      rule_types: ["rules", "probabilities"],
      categories: [
        { value: "general", label: "General", image: "/vectors/general.svg" },
        { value: "goals", label: "Goals", image: "/vectors/goals.svg" },
        { value: "half", label: "Half", image: "/vectors/half.svg" },
        { value: "corners", label: "Corners", image: "/vectors/corners.svg" },
        { value: "cards", label: "Cards", image: "/vectors/cards.svg" },

        {
          value: "probability",
          label: "Probability",
          image: "/vectors/probability.png"
        }
      ],
      teams: [
        { value: "home", text: "Home Team" },
        { value: "away", text: "Away Team" },
        { value: "both", text: "Both Teams" }
      ],
      locations: [
        { value: "home", text: "Home" },
        { value: "away", text: "Away" },
        { value: "overall", text: "Overall" }
      ],
      comparators: [
        { value: ">=", text: "More than or equals to" },
        { value: "<=", text: "Less than or equals to" }
      ],
      setting: {
        category: "general",
        team: "both",
        location: "overall",
        comparator: ">=",
        value: 1
      },
      edit_index: 0,
      edit_mode: null,
      show_edit: false
    };
  },
  mounted() {
    this.$store.dispatch("fetchPreMatchRules");
    this.$store.dispatch("fetchOutcomes", true);
  },
  watch: {
    "setting.category"(val) {
      //this.setting.id = null;
    }
  },
  methods: {
    editRule(index, mode) {
      this.edit_index = index;
      this.edit_mode = mode;
      this.show_edit = true;
    },
    addRule() {
      var data = this.setting;
      if (this.setting.rule_id != null) {
        var { comparator, value, rule_id } = data;
        switch (this.setting.category) {

          case "probability":
            var { comparator, value, rule_id } = data;
            this.form.probabilities.push(
              this.$jsonify({
                comparator,
                value,
                rule_id
              })
            );
            break;
          default:
            this.form.rules.push(this.$jsonify(data));
        }
      }
    },
    async createBetBuilder() {
      try {
        const bet_builder = await this.$axios.$post(
          "/admin/bet-builders/create",
          this.form
        );
        console.log(bet_builder);
        this.$router.push({ name: "admin-bet-builders" });
      } catch (error) {
        console.error(error);
      }
    }
  },
  components: {
    BetBuilderEditor,
    BetBuilderPreview
  },
  computed: {
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    rules() {
      if (this.$store.getters.lookupPreMatchRules) {
        const rules = this.$store.getters.lookupPreMatchRules;
        return Object.assign(
          {},
          ...Object.values(rules).map(item => ({ [item.id]: item }))
        );
      }
    },
    leagues() {
      return this.$store.state.leagues.map(league => {
        return {
          value: league.value,
          text: league.text
        };
      });
    },
    outcomes() {
      if (this.$store.state.outcomes) {
        const outcomes = this.$store.state.outcomes;
        return outcomes.map(x => {
          return {
            value: x.code,
            label: x.label
          };
        });
      }
    },
    rulesInCategory() {
      if (this.rules) {
        return Object.values(this.rules)
          .filter(x => x.category == this.setting.category)
          .map(x => {
            return {
              value: x.id,
              label: x.label
            };
          });
      }
    }
  }
};
</script>

<style lang="scss">
.footy-setting-checkbox-group {
  .custom-control.custom-checkbox {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
