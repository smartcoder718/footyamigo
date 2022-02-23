<template>
  <b-row align-h="center" class="footy-page-container" no-gutters>
    <b-col style="max-width: 530px">
      <div class="row-gap-30 flex-col">
        <div>
          <label class="footy-label">Alert Name</label>
          <b-input
            class="footy-input"
            placeholder="New Alert 2"
            v-model="form.title"
          >
          </b-input>
        </div>
        <div>
          <label class="text-center mb-3 footy-label centered">
            What type of PreMatch Alert do You Want to Create?
          </label>

          <footy-radio
            :options="categories"
            v-model="selectedCategory"
            fillWidth
            radioClass="centered"
            id="rules-selection"
            :noWrap="true"
            class="radio-boxes"
          >
          </footy-radio>
        </div>

        <b-button
          variant="primary"
          block
          @click="nextStep"
          class="footy-button"
          :disabled="nextDisabled"
              href="#create-strategy"
        >
          Next Step
          <NextIcon />
        </b-button>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import NextIcon from "~/static/icons/east.svg";
export default {
  // scrollToTop: true,
  props: {
    value: Object,
    category: String
  },
  data() {
    return {
      categories: [
        {
          value: "general",
          text: "General",
          image: "/vectors/general.svg",
          imgclass: "rules-icon"
        },
        {
          value: "goals",
          text: "Goals",
          image: "/vectors/goals.svg",
          imgclass: "rules-icon"
        },
        
        {
          value: "streak",
          text: "Streak",
          image: "/vectors/streak.svg",
          imgclass: "rules-icon"
        },
        {
          value: "half",
          text: "Half",
          image: "/vectors/half.svg",
          imgclass: "rules-icon"
        },
        {
          value: "corners",
          text: "Corners",
          image: "/vectors/corners.svg",
          imgclass: "rules-icon"
        },
        {
          value: "odds",
          text: "Odds",
          image: "/vectors/odds.svg",
          imgclass: "rules-icon"
        }
      ]
    };
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
    selectedCategory: {
      get() {
        return this.category;
      },
      set(val) {
        this.$emit("update:category", val);
      }
    },
    nextDisabled() {
      return this.form.title.length == 0;
    }
  },
  components: {
    NextIcon
  },
  methods: {
    nextStep() {
      this.$emit("nextstep");
      this.$store.commit("addStep");
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/colors.scss";
@import "~assets/scss/breakpoints";
// .footy-page-container {
//   padding: 20px 12px;
//   background: $light;
//   border-radius: 20px;
//   @media screen and (min-width: $lg) {
//     & {
//       padding: 64px 40px;
//     }
//   }
// }
</style>
