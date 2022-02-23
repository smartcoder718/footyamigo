<template>
  <div class="sidebar-inner">
    <div class="sidebar-top">
      <div class="sidebar-top-menu">
        <div class="centered d-none d-lg-block">
          <b-img-lazy src="/logo.png" class="footy-sidebar-logo"></b-img-lazy>
        </div>
        <div class="d-lg-none">
          <div class="mobile-spacer"></div>
        </div>
        <b-list-group>
          <b-list-group-item
            :to="sidebarItem.slug"
            class="sidebar-item"
            v-for="(sidebarItem, i) in sidebarItems"
            :key="i + sidebarItem.slug"
            ><div class="sidebar-item-text">
              <div class="sidebar-icon">
                <component v-bind:is="sidebarItem.icon"></component>
              </div>
              {{ sidebarItem.text }}
              <b-badge v-if="sidebarItem.new" variant="yellow" class="ml-2">NEW</b-badge>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div v-if="$store.getters.subscriptionType != 'pro'">
        <b-button
          class="footy-button centered"
          block
          variant="outline-primary"
          to="/profile/subscription"
          >Go Pro • £24.99
        </b-button>
      </div>
      <div v-else>
        <b-button
          class="footy-button centered"
          block
          variant="outline-primary"
          to="/profile/help"
          ><HelpIcon class="icon-left" /> Get Help
        </b-button>
      </div>
    </div>
    <div class="sidebar-bottom">
      <SidebarFooter class="d-none d-lg-block"></SidebarFooter>
    </div>
  </div>
</template>

<script>
import DashboardIcon from "@/static/icons/dasboard.svg";
import PrematchIcon from "@/static/icons/prematch.svg";
import InplayIcon from "@/static/icons/in-play.svg";
import FixturesIcon from "@/static/icons/fixtures.svg";
import ValueIcon from "@/static/icons/value.svg";
import BettingIcon from "@/static/icons/betting.svg";
import BetIcon from "@/static/icons/bet.svg";
import StarIcon from "@/static/icons/star.svg";
import SidebarFooter from "./common/SidebarFooter.vue";

export default {
  components: { SidebarFooter, DashboardIcon },
  props: {
    value: Boolean,
  },
  data() {
    return {
      sidebarItems: [
        {
          icon: DashboardIcon,
          text: "Dashboard",
          slug: "/dashboard",
        },
        {
          icon: PrematchIcon,
          text: "PreMatch Alerts",
          slug: "/pre-match-alerts",
        },
        {
          icon: InplayIcon,
          text: "InPlay Alerts",
          slug: "/in-play-alerts",
        },
        {
          icon: FixturesIcon,
          text: "Fixtures",
          slug: "/fixtures",
        },

        {
          icon: StarIcon,
          text: "Streaks",
          slug: "/streaks",
          new: true,
        },
        {
          icon: BettingIcon,
          text: "Betting Systems",
          slug: "/betting-systems",
        },
        {
          icon: BetIcon,
          text: "Bet Builder",
          slug: "/bet-builder",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "~assets/scss/colors";

.footy-sidebar-logo {
  height: 102px;
  width: 124px;
  margin-top: 10px;
  margin-bottom: 30px;
}

.sidebar-item {
  padding: 18px 22px !important;
  //max-height: 54px;
  vertical-align: middle;
  // margin-bottom: 1px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  border-radius: 8px;
  border: none !important;
  &.nuxt-link-active {
    background: $primary;
    color: white;
  }

  &.nuxt-link-exact-active {
    background: $primary;
    color: white;
  }
  &.nuxt-link-active {
    background: $primary !important;
    color: white !important;
    svg {
      filter: grayscale(1) brightness(0) invert(1) !important;
    }
  }
}

.sidebar-top-menu {
  overflow: hidden;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  margin-bottom: 10px;
}
.sidebar-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  margin-right: 16px;
}

.sidebar-item-text {
  display: flex;
  align-items: center;
  height: 20px !important;
}

.go-pro {
  //background-image: url("~/static/icons/mask.svg?inline");
  background-position-x: center;

  background-size: cover;
}

.sidebar-top {
  //width: 256px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  padding: 20px 20px;
  flex-direction: column;
  box-shadow: 1px 0px 0px rgba(0, 0, 0, 0.1);
  background: white;
  overflow: hidden;
  //padding-bottom: 96px;

  flex: 1;
  width: 100%;
  justify-content: space-between;
}

.sidebar-inner {
  overflow: hidden;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.mobile-spacer {
  margin-bottom: 90px;
}
</style>
