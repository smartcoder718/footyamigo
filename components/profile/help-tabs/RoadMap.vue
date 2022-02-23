<template>
  <div class="change-log-updates">
    <h3>
      Product Roadmap 💡
    </h3>
    <h6 class="fw-normal text-grey">
      Our vision is to “use the best innovative technolgy to help everyone who
      bets on football — Bet smart, with Confidence and Ease.” With this in
      mind, our product roadmap includes plans and updates we are working on to
      make Footy Amigo better.
    </h6>

    <div class="change-log-items">
      <div
        v-for="(update, index) in updates"
        :key="index"
        class="change-log-item"
      >
        <div class="mb-2">
          <strong
            style="font-size: 10px;
line-height: 15px"
            class="text-grey text-uppercase pl-2"
            >{{ update.title }}</strong
          >
        </div>
        <div class="d-flex align-items-flex-start gap-10">
          <div style="width:20px;">
            <CheckIcon />
          </div>

          <div
            v-html="update.content"
            style="font-size: 12px;
line-height: 18px;"
            class="text-grey"
          ></div>
        </div>
      </div>
      <MugenScroll
        :handler="fetchRoadmap"
        :should-handle="!loading"
        v-if="!loaded"
      >
      </MugenScroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      loaded: false,
      updates: [],
      page: 1
    };
  },
  methods: {
    async fetchRoadmap() {
      try {
        this.loading = true;
        const updates = await this.$axios.$get("/user/updates/roadmap", {
          params: { page: this.page }
        });
        this.updates = updates;
        if (updates.length < 50) {
          this.loaded = true;
        }
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
.change-log-updates {
  display: grid;
  gap: 16px;
  align-content: flex-start;

  max-width: 549px;
  .change-log-items-background {
    border-radius: 12px;
  }
  .change-log-items {
    padding: 40px 23px;
    border: 1px solid #d5ded5;
    background: white;
    box-sizing: border-box;
    border-radius: 12px;
    display: grid;
    // grid-gap: 20px;
    height: 476px;
    align-content: flex-start;
    overflow-y: auto;
    .change-log-item {
      padding: 12px 0px;
      border-bottom: 3px solid $lightgrey;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
@media screen and (max-width: $lg) {
  .change-log-updates {
    .change-log-items {
      padding: 20px 16px;
    }
  }
}
</style>
