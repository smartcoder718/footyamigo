<template>
  <GeneralPage :pageTitle="pageTitle" :pageDescription="pageDescription">
    <template v-slot:pageButton>
      {{ "" }}
    </template>
    <template v-slot:howItWorks>
      <HowItWorks location="betting-systems"  />
    </template>
    <hr class="betting-systems-hr" />
    <div class="footy-page-container">
      <div class="betting-systems-grid grid-col-md-2 grid-col-lg-3">
        <nuxt-link
          class="betting-systems-card"
          :class="$store.getters.isPro ? '' : 'is-trial'"
          :to="$store.getters.isPro ? '/betting-systems/view/'+system.id : '#'"
          v-for="(system, i) in betting_systems"
          :key="i"
        >
          <b-overlay :show="loading">
            <div
              class="betting-systems-card-content"
              :class="[loading ? 'opacity-0' : '']"
            >
              <h4 class="header-size-2 mb-2">{{ system.title }}</h4>
              <h6
                class="mb-3 text-grey text-justify betting-systems-description"
              >
                {{ system.description  | truncate}}
              </h6>

              <b-button block class="betting-systems-roi">
                <h6 class="text-primary">ROI: {{ system.roi }}%</h6>
              </b-button>
            </div>

            <div class="bg-image "></div>
            <div class="show-upgrade">
              <b-img
                class="img mb-4"
                src="/vectors/pro.svg"
                fluid
                height="85"
                width="85"
              >
              </b-img>
              <h1 class="header-size-1">
                Pro Subscription
              </h1>

              <h6 class="text-grey mb-1">
                Upgrade to Pro version to see the content
              </h6>
              <b-button
                class="footy-button footy-button-xs"
                variant="primary"
                to="/profile/subscription"
              >
                Upgrade to Pro
              </b-button>
            </div>
          </b-overlay>
        </nuxt-link>
      </div>
    </div>
  </GeneralPage>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: "Betting Systems",
      pageDescription:
        "Any successful football bettor has a system they follow. We have spent time creating these profitable, rigorously tested betting systems for our users. The systems below require discipline, patience an active Footy Amigo subscription.",
      systems: [],
      loading: false,

      demo_systems: []
    };
  },
  mounted() {
    this.fetchBettingSystem();
  },
  computed: {
    betting_systems() {
      const demo_system = {
        title: "The Under X In-Play System Earner",
        description:
          "Tested with over 600 bets and profitable since day 1, the Under-X In-Plusing FootyStats' goal stats to absolutely minimize losing chance on an Under-X In-Play bet. Repeat multiple wins to build a big, profit over-time. This one takes patience.  This one takes patienceThis one takes patienceThis one takes patienceThis one takes patience This one takes patience. This one takes patience.This one takes patience.",
        roi: 300
      };
      if (this.loading) {
        return Array(6).fill(demo_system);
      } else {
        return this.systems;
      }
    }
  },
  methods: {
    viewSystem(id) {
      if (1) this.$router.push("/betting-systems/view/" + id);
    },
    async fetchBettingSystem() {
      try {
        this.loading = true;
        const betting_systems = await this.$axios.$get("/user/betting-systems");
        this.systems = betting_systems;
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

.opacity-0 {
  opacity: 0;
}
.betting-systems-grid {
  display: grid;
  grid-gap: 20px;
}

.betting-systems-container {
  padding: 16px;
  background: #f7f9f7;
  border-radius: 20px;
  margin-bottom: 24px;
}
.betting-systems-description {
  // height: 150px;
  max-width: 100%;
  overflow: hidden;
  font-weight: 400;
  text-overflow: ellipsis;
}
.betting-systems-hr {
  margin-top: 20px;
  margin-bottom: 20px;
}
.betting-systems-card {
  background: white;
  border: 1px solid #cfd8cf;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  //height: 100%;
  .show-upgrade {
    display: none;
  }
  &:hover {
    background: $light;
  }
  &.is-trial:hover {
    .betting-systems-card-content {
      filter: blur(18px);
    }
    .show-upgrade {
      display: flex;
      width: 100%;
      border-radius: 12px;
      height: 100%;
      flex-direction: column;
      position: absolute;
      top: 0px;
      row-gap: 4px;
      left: 0px;
      cursor: not-allowed;
      justify-content: center;
      padding: 20px;
      z-index: 2;
    }
  }
}

.betting-systems-roi {
  display: flex;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8.5px;
  margin-top: auto;
  /* green-300 */

  background: #eef5ed;
  border-radius: 2px;
}
@media only screen and (min-width: $lg) {
  .betting-systems-container {
    padding: 20px;
  }
  .betting-systems-page-title {
    margin-bottom: 16px;
    font-size: 48px;
    line-height: 72px;
    /* identical to box height */
    letter-spacing: -1px;
  }
  .betting-systems-hr {
    margin-top: 32px;
    margin-bottom: 30px;
  }
  .betting-systems-page-description {
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
  }
  .betting-systems-card {
    background: white;
    padding: 20px;
  }
}
</style>
