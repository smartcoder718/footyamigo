<template>
  <div class="steps">
    <div
      class="step-tab"
      :class="getClass(step)"
      v-for="(name, step) in steps"
      :key="step"
    >
      <span class="material-icons checkmark"> check </span>

      {{ name }}

      <template v-if="step == 0">
        <span class="ml-2">
          {{ rulesCountText }}
        </span>
      </template>
    
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currStep: Number,
    value: Object,
    rulesCountText: String,

  },
  data() {
    return {
      steps: ["rules", "outcome", "settings"]
    };
  },
  computed: {
    rulesCount() {
      this.form.strategy_prematch_rules.length +
        this.form.strategy_inplay_rules.length;
    },
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    getClass(step) {
      step += 1;
      if (step < this.currStep) {
        return "step-completed";
      } else if (step == this.currStep) {
        return "step-active";
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.steps {
  

  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
overflow:hidden;
  // margin-bottom: 20px;
}

.steps {
  display: flex;
  justify-content: space-between;
  text-align: center;
  border: 1px solid #d5ded5;

  border-radius: 12px;
  background: white;
  // margin-bottom: 30px;
  overflow: hidden;
  color: $dark-1;

  .step-tab {
    flex: 1;
    padding-top: 10px;
    padding-bottom: 10px;
    // border-right: 1px solid #d5ded5;
    opacity: 0.5;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .checkmark {
      border-radius: 50%;
      background: #4d504d;
      color: white;
      font-size: 10px;
      width: 16px;
      height: 16px;
      font-weight: 900;
      line-height: 16px;
      margin-right: 10px;
    }
    .dot {
      font-size: 8px;
      margin-left: 5px;
      margin-right: 5px;
    }
    &.step-completed {
      opacity: 1;
      color: #60b15a;
      border-radius: 10px;
      background: #eef5ed;
      .checkmark {
        background: #60b15a;
      }
      &::before {
        content: "";

        background-image: url("~/static/icons/colored.svg?inline");
      }
    }
    &.step-active {
      opacity: 1;
    }
    &::before {
      content: "";
      position: absolute;
      right: -18px;
      z-index: 1;
      bottom: 0;
      background-image: url("~/static/icons/border.svg?inline");
      height: 100%;
      width: 20px;
      background-repeat: no-repeat;
    }
  }
  .step-tab:last-child {
    border-right: none;
    &::before {
      background-image: none;
      content: "";
    }
  }
}
@media (max-width: $lg) {
  .steps {
    font-size: 12px;
    line-height: 18px;
    .step-tab .checkmark {
      width: 13px;
      height: 13px;
      font-size: 9px;
    }
  }

  .steps {
    .step-tab {
      .checkmark {
        margin: 0 5px;
        margin-left: 15px;
      }
      &:first-child {
        justify-content: flex-start !important;
        padding-right: 0px !important;
      }
      &:last-child {
        .checkmark {
          margin-right: 5px;
          font-size: 9.5px;
        }
      }
      .material-icons.checkmark {
   
        display: flexa;
        align-items: center;
        justify-content: center;
      }
      &::before {
        content: "";
        position: absolute;
        right: -10px;
        top: -2px;
        z-index: 1;
        bottom: 0;
        background-image: url("~/static/icons/border.svg?inline");
        height: 100%;
        width: 20px;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
