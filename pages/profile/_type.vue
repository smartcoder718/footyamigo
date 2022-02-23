<template>
  <GeneralPage pageTitle="Profile" class="" extraHeaderClass="flex-row">
    <template v-slot:howItWorks> <div>
      </div></template>
    <template v-slot:pageButton>
      <b-button class="ml-auto footy-button" @click="logOut">
        <LogoutIcon class="nav-icon-left" />
        <span class="text"> Logout </span>
      </b-button>
    </template>
    <section>
      <b-button-group class="column-gap-10 mb-5 scroll-on-mobile">
        <b-button
          :to="'/profile/' + tab.id"
          v-for="tab in tabs"
          class="footy-button"
          :key="tab.id"
          ><div class="tab-title">
            <component :is="tab.icon" class="nav-icon-left" />
            <span class="text"> {{ tab.title }} </span>
          </div>
        </b-button>
      </b-button-group>
      <component :is="activePage"> </component>
    </section>
  </GeneralPage>
</template>
<script>
import AccountTab from "~/components/profile/AccountTab";
import SubscriptionTab from "~/components/profile/SubscriptionTab";
import SettingsTab from "~/components/profile/SettingsTab";
import PasswordTab from "~/components/profile/PasswordTab";
import HelpTab from "~/components/profile/HelpTab";
import AccountIcon from "~/static/icons/account.svg";
import SubscriptionIcon from "~/static/icons/subscription.svg";
import BellIcon from "~/static/icons/bell.svg";
import LogoutIcon from "~/static/icons/logout.svg";
import HelpIcon from "~/static/icons/help.svg";
import PasswordIcon from "~/static/icons/password.svg";

export default {
  data() {
    return {
      tabIndex: 0,
      customFile: null,
      tabs: [
        {
          title: "Account",
          icon: AccountIcon,
          component: AccountTab,
          id: "account"
        },
        {
          title: "Subscription",
          icon: SubscriptionIcon,
          component: SubscriptionTab,
          id: "subscription"
        },
        {
          title: "Settings",
          icon: BellIcon,
          component: SettingsTab,
          id: "settings"
        },
        {
          title: "Password & Security",
          icon: PasswordIcon,
          component: PasswordTab,
          id: "password"
        },
        {
          title: "Get Help",
          icon: HelpIcon,
          component: HelpTab,
          id: "help"
        }
      ]
    };
  },
  components: {
    AccountIcon,
    BellIcon,
    LogoutIcon,
    SubscriptionIcon,
    PasswordIcon,

    HelpTab
  },
  computed: {
    activePage() {
      const tabs = {
        account: AccountTab,
        subscription: SubscriptionTab,
        settings: SettingsTab,
        password: PasswordTab,
        help: HelpTab
      };
      return tabs[(this.$route.params.type || "account").toLowerCase()];
    }
  },
  methods: {
    async logOut() {
      await this.$axios.$get("/user/logout");
      window.location.replace("/auth/login");
    },
    selected(reference, upload) {
      if (upload) {
        this.$refs[reference].click();
      } else {
        this.src = `/icons/avatar.svg?inline`;
      }
      this.$refs.uploadDropdown.hide(true);
    }
  }
};
</script>
<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.profile {
  .nav-item a {
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 18px 24px;
    .material-icons-outlined {
      font-size: 15px;
    }
  }

  .nav-link {
    background: #eef5ed;
    color: $dark-1;
  }
  .tab-title {
    font-size: 13px;
    line-height: 18px;
    /* identical to box height, or 138% */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .nav-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .stat-header {
    border: none !important;
    background: none;
    padding: 0px !important;

    .nav {
      flex-wrap: nowrap;
      overflow-x: auto;
      margin-left: 0px !important;
      margin-right: 0px !important;
      .nav-item {
        a {
          height: 54px;
          white-space: nowrap;
          .text {
            font-weight: 600;
            font-size: 13px;
            line-height: 18px;
            text-align: center;
          }
          &.active {
            .text {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .tabs {
    .card-body {
      padding: 0px;
    }
    .account-form {
      margin-top: 24px;
    }
  }
}

@media (max-width: $lg) {
  .profile {
    .footy-page-header {
      .page-title {
        font-size: 24px;
        line-height: 36px;
      }
    }
    .mobile-subscriptions-table,
    .mobile-payments-table {
      .field {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 24px;
        row-gap: 12px;
        margin-bottom: 12px;

        .field-heading,
        .field-value {
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
          text-transform: uppercase;
          color: rgba(34, 38, 34, 0.7);
          text-align: left;
          &.active,
          &.danger {
            background: #60b15a;
            border-radius: 2px;
            width: 61px;
            height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            margin-left: auto;
            font-weight: 600;
            font-size: 14px;
          }
          &.danger {
            background: #ffefef;
            color: #dc6060;
          }
        }
        .field-value {
          text-align: right;
        }
      }
    }
    .mobile-payments-table {
      .field {
        grid-template-columns: 1fr;
        margin-bottom: 20px;
        row-gap: 8px;
        .field-heading,
        .field-value {
          text-align: left;
        }
      }
    }

    .tabs {
      .setting-tab {
        .telegram {
          padding: 16px;
          max-width: 343px;
          width: 100%;
          .telegram-inner {
            width: 100%;
            flex-direction: column;
            > div {
              flex: 0 0 100%;
              max-width: 100%;
            }
            .connect-disconnect {
              background: #eef5ed;
              border-radius: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 54px;
              width: 100%;
              padding: 0px;
              margin-top: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
