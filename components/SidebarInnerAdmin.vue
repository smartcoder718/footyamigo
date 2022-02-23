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
            :to="'/admin/' + sidebarItem.slug"
            class="sidebar-item"
            v-for="(sidebarItem, i) in sidebarItems"
            :key="i + sidebarItem.slug"
            ><div class="sidebar-item-text">
              <div class="sidebar-icon">
                <component v-bind:is="sidebarItem.icon"></component>
              </div>
              {{ sidebarItem.text }}
            </div></b-list-group-item
          >
        </b-list-group>
      </div>
      <div v-if="!$store.getters.subscriptionType">
        <b-button
          class="footy-button centered"
          block
          variant="outline-primary"
          to="/dashboard"
          >Homepage
        </b-button>
      </div>
    </div>
    <div class="sidebar-bottom"></div>
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

import SidebarFooter from "./common/SidebarFooter.vue";

export default {
  components: { SidebarFooter, DashboardIcon },
  props: {
    value: Boolean,
  },
  data() {
    return {
      sidebarItems: [
        { icon: DashboardIcon, slug: "dashboard", text: "Dashboard" },
        { icon: PrematchIcon, slug: "users", text: "Users" },
        {
          icon: FixturesIcon,
          slug: "betting-systems",
          text: "Betting Systems",
        },
        {
          icon: InplayIcon,
          slug: "streaks",
          text: "Streaks",
        },
        { icon: ValueIcon, slug: "broadcast", text: "Broadcast" },
        { icon: "SearchIcon", slug: "presets", text: "Presets" },
        { icon: BetIcon, slug: "bet-builders", text: "Bet Builders" },
        { icon: ValueIcon, slug: "plans", text: "Plans" },
        { icon: BettingIcon, slug: "local-countries", text: "Local Countries" },
        {
          icon: InplayIcon,
          text: "Page Videos",
          slug: "page-videos",
        },
        {
          icon: FixturesIcon,
          text: "Updates",
          slug: "updates",
        },
      ],
    };
  },
  methods: {
    toPro() {
      this.$router.push({
        path: "/profile",
        query: {
          proUser: true,
        },
      });
    },
  },
};
</script>
