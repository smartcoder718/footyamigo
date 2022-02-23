<template>
  <div
    class="todays-highlights page-content-box"
    style="height: 100%; min-height:200px;"
  >
    <div
      class="
        highlight-text
        d-flex
        flex-md-row flex-column
        justify-content-between
        align-items-md-center align-items-start
      "
    >
      <div class="img-title d-flex align-items-center">
        <b-img src="/vectors/highlights.svg" fluid> </b-img>
        <h2 class="inner-heading">Today's Highlights</h2>
      </div>
      <p class="mb-0 highlights-date">
        {{
          $moment()
            .local()
            .format("ll")
        }}
      </p>
    </div>
    <b-overlay :show="loading">
      <b-row class="highlight-box-wrapper" cols-xl="4" cols="2" no-gutters>
        <template v-if="highlights">
          <b-col v-for="highlight in highlights" :key="highlight.id">
            <div class="highlight-box">
              <p class="count">
                {{ highlight.count }}
              </p>
              <p class="matches">{{ highlight.subtitle }}</p>
              <p class="strategy_name">{{ highlight.title }}</p>
            </div>
          </b-col>
        </template>
      </b-row>
    </b-overlay>

    <!-- <h4 v-else class="centered">
      Create an highlight strategy to see highlights here!
    </h4> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      highlights: null,
      loading: true
    };
  },

  beforeMount() {
    this.getHighlights();
  },

  methods: {
    async getHighlights() {
      try {
        this.loading = true;
        this.highlights = await this.$axios.$get("/user/highlights");
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.highlight-box {
  border-radius: 12px;
  margin: 5px !important;
  height: 124px;
  text-align: center;
  display: flex;
  flex-direction: column;
  color: $primary;
  background: white;
  padding: 8px;

  .count,
  .matches,
  .strategy_name {
    // font-family: "Poppins", sans-serif;
    font-style: normal;
    font-weight: 600 !important;
  }
  .count {
    font-weight: bold !important;
    font-size: 36px;
    line-height: 54px;
  }
  .matches {
    font-size: 12px;
    line-height: 18px;
    margin-top: -6px;
    margin-bottom: 7px;
  }
  .strategy_name {
    font-size: 11px;
    line-height: 16px;
    color: #60685f;
  }
}
.todays-highlights {
  min-height: 218px;
  padding: 20px;
  border-radius: 12px;
  .number {
    display: flex;
    flex-direction: column;
    span:first-child {
      font-weight: bold;
      font-size: 36px;
    }
  }
  .highlight-text {
    .inner-heading {
      margin-left: 14px;
    }
    .highlights-date {
      // font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 600 !important;
      font-size: 14px;
      line-height: 21px;
      color: #60685f;
    }
    margin-bottom: 20px;
  }
}
@media (max-width: $lg) {
  .todays-highlights .highlight-text .highlights-date {
    margin-left: 46px;
    margin-top: 2px;
  }
  .highlight-box-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr !important;
    column-gap: 20px;
    justify-content: center;
    row-gap: 20px;
    // align-items: center;
    .highlight-box {
      margin: 0px !important;
      width: 100%;
      max-width: 100%;
      align-items: center;
      justify-content: center;
    }
  }
  .todays-highlights {
    padding: 20px 16px;
  }
  .highlight-box {
    .count {
      font-size: 30px;
      line-height: 45px;
    }
  }
  .highlight-box-wrapper {
    &.row-cols-2 > * {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
}
</style>
