<template>
  <div class="live-preview wrap-on-mobile">
    <div class="live-preview-details">
      <div class="text-white mr-2">
        <p class="live-thin">Preview</p>

        <p class="live-text" v-html="preview"></p>
      </div>
    </div>

    <div class="footy-button-group wrap-on-mobile">
      <b-button @click="$emit('addRule')" class="footy-button" block>
        <span class="mr-2">
          <img :src="`/icons/add.svg?inline`" alt="" />
        </span>
        <span class="text" style="display: inline-block">
          Add {{ rulesCount > 0 ? "Another" : "" }} Rule
        </span>
      </b-button>

      <b-button
        :disabled="!nextButtonEnabled"
        @click="$emit('nextstep')"
        class="footy-button"
        block
        href="#create-strategy"
      >
        <span class="text" style="display: inline-block"> Next Step </span>
        <span class="ml-2">
          <img :src="`/icons/eastgreen.svg?inline`" alt="" /> </span
      ></b-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: Object,
    rulesCount: Number,
    strategyType: String,
    preview: String,
  },
  methods: {
    // addRule() {
    //   if (this.strategyType == "pre-match-alerts") {
    //     this.form.strategy_prematch_rules.push(
    //       this.$jsonify(this.$store.state.setting)
    //     );
    //   } else {
    //     this.form.strategy_inplay_rules.push(
    //       this.$jsonify(this.$store.state.setting_in_play)
    //     );
    //   }
    // },
  },
  computed: {
    // preview() {
    //   if (this.strategyType == "pre-match-alerts") {
    //     return this.$getPreMatchPreview(
    //       this.$store.state.setting,
    //       this.$store.getters.lookupPreMatchRules
    //     );
    //   } else {
    //     return this.$getInPlayPreview(
    //       this.$store.state.setting_in_play,
    //       // this.$store.state.in_play_timer,
    //       this.$store.getters.lookupInPlayRules
    //     );
    //   }
    // },
    nextButtonEnabled() {
      const validTitle =
        this.form.title.length > 3 && this.form.title.length <= 50;
      if (this.strategyType == "pre-match-alerts") {
        return this.rulesCount > 2 && validTitle;
      } else {
        return this.form.strategy_inplay_rules.length > 0 && validTitle;
      }
    },
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/breakpoints";
@import "~/assets/scss/colors";
.live-preview {
  border-radius: 0px 0px 20px 20px;
  padding: 20px 40px;
  background: $primary;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  column-gap: 20px;
  .live-preview-details {
    flex: 1;
  }
  .live-text,
  .live-thin {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;

    align-items: center;
    color: #eef5ed;
    margin: 0;
  }
  .live-text {
    font-size: 16px;
    line-height: 24px;
    margin-top: 4px;
    color: #fff;
  }
}

@media screen and (max-width: $lg) {
  .live-preview {
    padding: 12px;
  }
}
</style>
