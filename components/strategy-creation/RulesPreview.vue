<template>
  <section
    class="footy-page-container rules-preview-container"
    style="height: 100%"
  >
    <h3 class="rules-preview-title">
      Rules Preview {{ rulesCountText }}

      <b-button
        variant="white"
        class="float-right rounded d-lg-none"
        @click="$emit('closestats')"
      >
        <span class="material-icons"> close </span>
      </b-button>
    </h3>
    <p
      v-if="strategyType == 'pre-match-alerts' && rulesCount < 3"
      class="text-grey mb-3"
    >
      ⚠️ Atleast 3 rules are required
    </p>
    <p
      v-else-if="strategyType == 'in-play-alerts' && strategyInplay.length < 1"
      class="text-grey mb-3"
    >
      ⚠️ Atleast 1 InPlay rule is required
    </p>
    <div
      v-for="(setting, index) in strategyPrematch"
      :key="'pre-match-settings ' + index"
      class="mb-3"
    >
      <div class="rule-item">
        <div style="rule-item-info">
          <h6 class="rule-title">
            Rule {{ index + 1 }} [
            {{
              preMatchRules[setting.rule_id]
                ? preMatchRules[setting.rule_id].category
                : setting.rule_id
            }}]
          </h6>
          <h6
            class="rule-description"
            v-html="$getPreMatchPreview(setting, preMatchRules)"
          ></h6>
        </div>
        <div class="rule-item-remover">
          <b-button
            variant="white"
            size="sm"
            class="danger-btn rule-delete"
            @click="deleteRule(index, 'prematch')"
          >
            <DeleteIcon />
          </b-button>
        </div>
      </div>
      <h6 class="rule-edit" @click="editRule(index, 'prematch')">Edit</h6>
    </div>
    <!-- {{ALL INPLAY RULES}} -->

    <div
      v-for="(setting, index) in strategyInplay"
      :key="'in-play-settings ' + index"
      class="mb-3"
    >
      <div class="rule-item">
        <div style="rule-item-info">
          <h6 class="rule-title">
            Rule {{ index + strategyPrematch.length + 1 }} [In Play
            {{ setting.first_category }}]
          </h6>
          <h6
            class="rule-description"
            v-html="$getInPlayPreview(setting, inPlayRules)"
          ></h6>
        </div>
        <div class="rule-item-remover">
          <b-button
            variant="white"
            size="sm"
            class="danger-btn rule-delete"
            @click="deleteRule(index, 'inplay')"
          >
            <DeleteIcon />
          </b-button>
        </div>
      </div>
      <h6 class="rule-edit" @click="editRule(index, 'inplay')">Edit</h6>
    </div>

    <b-modal
      id="pre-match-edit-modal"
      content-class="shadow rounded-sm border-0  "
      v-model="edit_mode"
      v-if="edit_mode"
      hide-footer
      size="lg"
    >
      <PreMatchRuleEditor
        v-model="edit_prematch"
        v-if="edit_type == 'prematch'"
      >
      </PreMatchRuleEditor>
      <InPlayRuleEditor v-else v-model="edit_in_play"> </InPlayRuleEditor>

      <b-row>
        <b-col>
          <b-button
            class="mt-3 footy-button"
            variant="secondary"
            block
            @click="cancelEdit"
            >Cancel</b-button
          >
        </b-col>
        <b-col>
          <b-button
            class="mt-3 footy-button"
            variant="success"
            block
            @click="saveEdit"
            >Done</b-button
          >
        </b-col>
      </b-row>
    </b-modal>
  </section>
</template>

<script>
import PreMatchRuleEditor from "./PreMatchRuleEditor.vue";
import InPlayRuleEditor from "./InPlayRuleEditor.vue";
import DeleteIcon from "~/static/icons/delete.svg";

function initialPreMatchSetting() {
  return {
    id: 2,
    values: [0, 6],
    comparator: "=",
    value: 1,
    team: "home",
    location: "home",
  };
}

function initialInPlaySetting() {
  return {
    first_rule_id: null,
    second_rule_id: null,
    first_team: "home",
    second_team: "away",
    first_category: "statistics",
    second_category: "numeric",
    comparator: "=",
    value: "1",
  };
}
export default {
  props: {
    value: Object,
    strategyType: String,
  },
  data() {
    return {
      edit_index: 0,
      edit_mode: false,
      edit_prematch: initialPreMatchSetting(),
      edit_in_play: initialInPlaySetting(),
    };
  },
  components: {
    PreMatchRuleEditor,
    InPlayRuleEditor,
    DeleteIcon,
  },
  computed: {
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    preMatchRules() {
      return this.$store.getters.lookupPreMatchRules;
    },
    inPlayRules() {
      return this.$store.getters.lookupInPlayRules;
    },
    strategyPrematch() {
      return this.form.strategy_prematch_rules;
    },
    strategyInplay() {
      return this.form.strategy_inplay_rules;
    },

    rulesCountText() {
      return this.rulesCount > 0 ? " • " + this.rulesCount : "";
    },
    rulesCount() {
      return this.strategyPrematch.length + this.strategyInplay.length;
    },
  },
  methods: {
    editRule(index, type) {
      this.edit_index = index;
      this.edit_mode = true;
      this.edit_type = type;

      if (type == "prematch") {
        Object.assign(
          this.edit_prematch,
          this.$jsonify(this.strategyPrematch[index])
        );
      } else {
        // console.log(this.strategyInplay[index]);
        this.$set(
          this,
          "edit_in_play",
          this.$jsonify(this.strategyInplay[index])
        );
        // this.edit_in_play = {...this.edit_in_play, ...this.$jsonify(this.strategyInplay[index])}

        // console.log(this.edit_in_play);
      }
    },
    saveEdit() {
      if (this.edit_type == "prematch") {
        Object.assign(
          this.strategyPrematch[this.edit_index],
          this.edit_prematch
        );
      } else {
        Object.assign(this.strategyInplay[this.edit_index], this.edit_in_play);
      }
      this.cancelEdit();
    },
    deleteRule(index, type) {
      if (type == "prematch") {
        // console.log(this.strategyPrematch, index);
        this.strategyPrematch.splice(index, 1);
      } else {
        this.strategyInplay.splice(index, 1);
      }
    },
    cancelEdit() {
      this.edit_mode = false;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";
@media screen and (min-width: $lg) {
  .rules-preview-container {
    min-height: 800px;
  }
}

.rules-preview-container {
  .rules-preview-title {
    margin-bottom: 30px;
  }
  .rule-title {
    font-weight: 600px;
    text-transform: capitalize;
    margin-bottom: 2px;
  }
  .rule-description {
    color: $grey;
    font-weight: 400;
    margin-bottom: 8px;
    span {
      color: $primary;
    }
  }
  .rule-edit {
    color: $primary;
    font-weight: bold;
  }
  .rule-item {
    display: flex;
    column-gap: 20px;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;
    .rule-item-info {
      flex: 3;
    }
    .rule-item-remover {
      flex: 3;
      display: flex;
      justify-content: flex-end;
    }
  }
  .rule-delete {
    border: 1px solid #d5ded5;
    box-sizing: border-box;
    border-radius: 4px;
  }
}
#pre-match-edit-modal___BV_modal_outer {
  z-index: 1077;
}
</style>
