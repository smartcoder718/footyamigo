<template>
  <GeneralPage :pageTitle="pageTitle">
    <template v-slot:pageButton>
      <div class="footy-button-group">
        <b-button
          class="footy-button"
          variant="secondary"
          block
          @click="cancelCreate"
        >
          <CloseIcon class="icon-left" />
          Cancel
        </b-button>
        <b-button
          class="footy-button"
          :disabled="!canSave"
          variant="primary"
          block
          @click="$emit('save')"
        >
          <SaveIcon class="icon-left" />

          Save Alert
        </b-button>
      </div>
    </template>
    <template v-slot:howItWorks> {{ "" }} </template>

    <div
      class="create-prematch-alert"
      v-if="$store.getters.lookupPreMatchRules"
    >
      <hr class="mb-4" />
      <slot name="categorySelection"> </slot>
      <section v-if="step > 0">
        <div
          style="column-gap: 26px; display: flex; flex-grow: 0; flex-shrink: 0"
          class="wrap-on-mobile"
        >
          <div style="flex: 7; max-width: 100%" class="mb-5">
            <slot name="ruleSelection" ref="ruleSelection" @save="saveStrategy">
            </slot>

            <!-- <LivePreview
              v-if="step == 1"
              @nextstep="$emit('nextstep')"
              @addrule="$emit('addrule')"
              v-model="form"
              :strategyType="strategyType"
              :rulesCount="rulesCount"
              :preview="preview"
            >
            </LivePreview> -->
          </div>

          <ModalOnMobile style="flex: 3; height: 100%" v-model="showPreview">
            <RulesPreview
              v-model="form"
              @closestats="showPreview = false"
              :strategyType="strategyType"
            >
            </RulesPreview
          ></ModalOnMobile>
        </div>

        <h3
          @click="openModal"
          class="d-lg-none border-top pt-3 cursor-pointer rules-heading text-center"
        >
          Rules Preview {{ rulesCountText }}

          <img class="icon ml-2" :src="`/icons/up.svg?inline`" alt="" />
        </h3>
      </section>
    </div>
    <slot></slot>

    <!-- <pre>
      <code>
 {{form["strategy_inplay_rules"]}}
      </code>
    </pre> -->
  </GeneralPage>
</template>

<script>
import GeneralPage from "../GeneralPage.vue";

import PreMatchSettings from "./PreMatchSettings.vue";
import LivePreview from "./LivePreview";
import RulesPreview from "./RulesPreview";
import CloseIcon from "@/static/icons/close.svg";
import SaveIcon from "@/static/icons/save-white.svg";

export default {
  //scrollToTop: true,
  props: {
    pageTitle: String,
    strategyType: String,
    step: Number,
    value: Object,
    rulesCountText: String,
    rulesCount: Number,
    preview: String,
  },
  data() {
    return {
      showPreview: false,
    };
  },

  methods: {
    cancelCreate() {
      this.$router.push("/" + this.strategyType);
    },

    openModal() {
      this.showPreview = true;
      // console.log(this.$refs["rules-preview-modal"], "test");
      //this.$refs["rules-preview-modal"].showModal = true;
    },
    scrollToTop() {
      // window.scrollTo(0, 0);
    },
  },
  components: {
    GeneralPage,
    PreMatchSettings,
    LivePreview,
    RulesPreview,
    CloseIcon,
    SaveIcon,
  },
  mounted() {
    this.$store.dispatch("fetchPreMatchRules");
    // this.$store.dispatch("fetchLeagues");
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

    canSave() {
      return (
        this.form.title.length > 3 &&
        this.form.title.length <= 50 &&
        this.form.outcome_id != null &&
        this.form.leagues.length > 0 &&
        this.rulesCount > 0 &&
        this.step > 0
      );
    },
  },
};
</script>

<style lang="scss">
.page-content {
  padding: 16px;
}
</style>
