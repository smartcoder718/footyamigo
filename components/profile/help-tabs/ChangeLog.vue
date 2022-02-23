<template>
  <div class="change-log-updates">
    <h3>
      Change Log Updates ⏳
    </h3>
    <h6 class="fw-normal text-grey">
      We believe in continuous improvements and taking your feedbacks on board.
      Here you will find the updates, improvements and changes to Footy Amigo.
    </h6>

    <div class="change-log-items">
      <div
        v-for="(update, index) in updates"
        :key="index"
        class="change-log-item"
      >
        <div>
          <strong
            style="font-size: 10px;
line-height: 15px"
            class="text-grey"
            >{{ $moment(update.datetime).format("LL") }}</strong
          >
        </div>

        <h2 class="text-primary">v{{ update.version }}</h2>
        <div
          v-html="update.content"
          style="font-size: 12px;
line-height: 18px;"
          class="text-grey"
        ></div>
      </div>
      <MugenScroll
        :handler="fetchChangeLog"
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
    async fetchChangeLog() {
      try {
        this.loading = true;
        const updates = await this.$axios.$get("/user/updates/changelog", {
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
