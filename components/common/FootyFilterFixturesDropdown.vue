<template>
  <div>
    <!-- <b-dropdown
      no-flip
      no-caret
      variant="light"
      dropdown
      ref="mydropdown"
      class="footy-filter-fixtures-dropdown d-none d-lg-block filter-button"
      toggle-class="centered"
    >
      <template slot="button-content">
        <FunnelIcon class="mr-2" />
        <span class="text-grey">
          {{ text }}
        </span>
      </template>

      <b-list-group class="bg-white text-body" style="width: 460px">
        <b-list-group-item class="lets-scale">
          <div class="" style="overflow: hidden; display: grid; gap: 20px">
            <template v-if="addMode">


              <PreMatchRules
                class="mr-demo bg-white"
                v-if="$store.state.pre_match_rules"
                v-model="form"
                @closeMode="addMode = false"
              >
              </PreMatchRules>
            </template>
            <template v-else>
              <div class="d-flex gap-10">
                <b-button
                  class="footy-button"
                  block
                  variant="primary"
                  @click="addMode = true"
                >
                  <PlusIcon class="icon-left" />
                  Add Rule
                </b-button>
                <b-button
                  class="footy-button"
                  block
                  variant="primary"
                  v-if="form.strategy_prematch_rules.length"
                  @click="$emit('search', form.strategy_prematch_rules)"
                >
                  <SearchIcon class="icon-left" />
                  Search
                </b-button>
              </div>

              <RulesPreview
                v-model="form"
                style="width: 100%"
                v-if="form.strategy_prematch_rules.length"
              >
              </RulesPreview>
            </template>
          </div>
        </b-list-group-item>
      </b-list-group>

      <slot> </slot>
    </b-dropdown> -->

    <div class="filter-button">
      <b-button
        @click="toggleModal"
        variant="light"
        class="centered dropdown-toggle-no-caret"
      >
        <FunnelIcon class="mr-2" />
        <span class="text-grey">
          {{ text }}
        </span>
      </b-button>
      <b-modal
        modal-class="footy-filter-dropdown-modal"
        centered
        v-model="activeModal"
        hide-footer
        size="md"
        content-class="footy-filter-modal-content"
      >
        <template #modal-title>
          <div class="d-flex" style="align-items: center; gap: 20px">
            {{ text }}
            <HowItWorks location="filters" />
          </div>
        </template>
        <div
          class="lets-scale"
          style="overflow: hidden; display: grid; gap: 20px"
        >
          <template v-if="addMode">
            <!-- <b-tabs justified>
              <b-tab title="Create" active>
                <div
                  class="footy-page-container middle-only bg-white"
                  style="overflow: hidden; display: grid; gap: 20px"
                >
                  <PreMatchRules
                    class="mr-demo bg-white"
                    v-if="$store.state.pre_match_rules"
                    v-model="form"
                    @closeMode="addMode = false"
                  >
                  </PreMatchRules>
                </div>
              </b-tab>
              <b-tab title="Saved"><p>I'm the second tab</p></b-tab>
            </b-tabs> -->

            <PreMatchRules
              class="mr-demo"
              style="height: 400px; overflow-y: auto"
              v-if="$store.state.pre_match_rules"
              v-model="form"
              @closeMode="addMode = false"
            >
            </PreMatchRules>
          </template>
          <template v-else>
            <div v-if="!form.strategy_prematch_rules.length">
              <h6 style="font-weight: 400; text-align: justify">
                Find Valuable Games in Seconds
                <br />
                <br />
                Use our new filter tool to comb through the fixtures page and
                find selections that meets your needs in seconds. Maybe you want
                to only see Home teams that have first half goals in 75% of
                their matches, or teams on a +2.5 goals streak in their last 5
                matches? Its all possible and can be done within seconds by
                adding (or mix matching) your rules to filter the fixture page.
                Exclusive to Pro Users.
              </h6>
            </div>

            <div class="d-flex gap-10">
              <b-button
                class="footy-button"
                block
                variant="primary"
                @click="addMode = true"
                v-if="isPro"
              >
                <PlusIcon class="icon-left" />

                <span class="">Add Rule</span>
              </b-button>
              <b-button
                class="footy-button"
                block
                variant="primary"
                to="/profile/subscription"
                v-else
              >
                <span class="">Upgrade to Pro</span>
              </b-button>
              <b-button
                class="footy-button"
                block
                variant="primary"
                v-if="form.strategy_prematch_rules.length"
                @click="searchData"
              >
                <SearchIcon class="icon-left" />
                Search
              </b-button>
            </div>
            <!-- <div v-if="!form.strategy_prematch_rules.length">
              <HowItWorks location="filters" />
            </div> -->

            <RulesPreview
              v-model="form"
              style="width: 100%"
              v-if="form.strategy_prematch_rules.length"
            >
            </RulesPreview>
          </template>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
function initialPreMatchForm() {
  return {
    id: null,
    title: "",
    strategy_prematch_rules: [],
    strategy_inplay_rules: [],
    outcome_id: null,
    needs_odds: false,
    is_public: true,
    timer: {
      minute: 15,
    },
    note: "",
    has_note: false,
    leagues: [],
  };
}
import RulesPreview from "@/components/strategy-creation/RulesPreviewMini";
import FunnelIcon from "~/static/icons/funnel.svg";
import SearchIcon from "~/static/icons/searcha.svg";
import PlusIcon from "~/static/icons/plus.svg";
import PreMatchRules from "@/components/strategy-creation/PreMatchRulesMini";

export default {
  data() {
    return {
      text: "Filters",
      activeModal: false,
      form: initialPreMatchForm(),
      addMode: false,
    };
  },
  components: {
    PreMatchRules,
    FunnelIcon,
    RulesPreview,
    SearchIcon,
    PlusIcon,
  },
  mounted() {
    this.$store.dispatch("fetchPreMatchRules");
  },
  computed: {
    isPro() {
      return this.$store.getters.isPro;
    },
  },
  methods: {
    toggleModal() {
      this.activeModal = !this.activeModal;
    },
    searchData() {
      this.$emit("search", this.form.strategy_prematch_rules);
      this.activeModal = false;
    },
  },
};
</script>

<style lang="scss">
.footy-filter-fixtures-dropdown {
  .list-group-item {
    border: none;
  }
  .description {
    font-size: 11px;
    line-height: 20px;
  }
}
.lets-scale {
  // transform: scale(0.95);
  width: 100%;
  overflow-y: auto;
}
.mr-demo {
  /* white */

  //background: #ffffff;
  /* green-300 */

  padding-top: 8px;
  padding-bottom: 8px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 8px;
  //height: 726px;

  // max-width: 398px;

  border-radius: 8px;
}
</style>
