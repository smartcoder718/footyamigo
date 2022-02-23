<template>
  <GeneralPage
    :pageTitle="pageTitle"
    class=""
    extraHeaderClass="flex-row"
    :pageDescription="pageDescription"
    ><template v-slot:howItWorks>
      {{ "" }}
    </template>

    <template v-slot:avatar>
      <b-button class="avatar d-lg-none" to="/profile">
        <b-img :src="avatarLink"> </b-img>
        <!-- <img
            :src="$store.getters.getAvatar"
            alt=""
            class="avatar-active"
            :key="$store.getters.getAvatar"
          /> -->
      </b-button>
    </template>
    <!-- <div class="avatar d-lg-none" to="/profile">
      <b-img :src="avatarLink"> </b-img>
      <img
            :src="$store.getters.getAvatar"
            alt=""
            class="avatar-active"
            :key="$store.getters.getAvatar"
          /> 
    </div> -->
    <template v-slot:pageButton>
      <div class="footy-button-group d-none d-lg-block">
        <b-button class="avatar" to="/profile">
          <b-img :src="avatarLink"> </b-img>
          <!-- <img
            :src="$store.getters.getAvatar"
            alt=""
            class="avatar-active"
            :key="$store.getters.getAvatar"
          /> -->
        </b-button>
      </div>

      <!-- <b-navbar-nav class="d-flex flex-row">
        <div class="nav-item">
          <b-navbar-nav
            v-if="showNotifications && notifications.length > 0"
            class="profile-down"
          >
            <div
              class="
                    notification-header
                    d-flex
                    justify-content-between
                    align-items-center
                  "
            >
              <h3>Notifications {{ " " + notifications.length }}</h3>
              <img
                @click="showNotifications = !showNotifications"
                class="cursor-pointer"
                src="/icons/closed.svg"
              />
            </div>
            <b-nav-item
              class="notification-item"
              v-for="(notification, i) in notifications"
              :key="i"
            >
              <h6>{{ notification.title }}</h6>
              <p>{{ notification.time }}</p>
            </b-nav-item>
          </b-navbar-nav>
        </div>
      </b-navbar-nav> -->
    </template>

    <div class="dashboard pt-4">
      <section class="d-grid gap-20">
        <div class="d-grid grid-col-1 grid-col-lg-2 gap-20">
          <Subscription> </Subscription>
          <Highlights></Highlights>
        </div>
        <div class="d-grid grid-col-1 grid-col-lg-2 gap-20">
          <RecentPicks> </RecentPicks>
          <StrikeRates> </StrikeRates>
        </div>
      </section>
    </div>
    <HowItWorks location="dashboard" ref="how" />
 
  </GeneralPage>
</template>
<script>
import RecentPicks from "~/components/RecentPicks";
import StrikeRates from "~/components/StrikeRates";
import Highlights from "~/components/Highlights";
import Subscription from "~/components/Subscription";

export default {
  data() {
    return {
      notifications: [
        {
          title: "Congrats on the internet loading your request",
          time: "2 min ago"
        },
        {
          title: "Congrats on the internet loading your request",
          time: "2 min ago"
        },
        {
          title: "Congrats on the internet loading your request",
          time: "2 min ago"
        }
      ],
      showVideo: false
    };
  },
  mounted() {
    const instance = this;
    setTimeout(() => {
      if (!instance.$auth.user.seen_intro) {
        instance.showVideo = true;
        instance.$refs.how.getVideo();
      }
    }, 3000);
  },
  computed: {
    pageTitle() {
      return (
        this.greet(new Date()) +
        ", <br class='d-lg-none'>" +
        this.$auth.user.firstname +
        " 👋"
      );
    },
    avatarLink() {
      return `/svg/${this.$auth.user.avatar_id}.svg`;
    },
    pageDescription() {
      if (!this.$auth.user.phone)
        return "⚠️ Important: <a href='/profile/settings'>Click here</a> to download our app to start receiving your alerts";
      // if (!this.$auth.user.telegram)
      //   return "⚠️ Important: <a href='/profile/settings'>Click here</a> to connect your Telegram account to receive alerts";
      return "Today is a great day to bet smart 👍🏽";
    }
  },
  methods: {
    greet(value) {
      var hrs = value.getHours();
      if (hrs > 17) return "Good evening";
      if (hrs > 12) return "Good afternoon";
      if (hrs >= 0) return "Good morning"; // REALLY early
      // After 6am
      // After 12pm
      // After 5pm
      // if (hrs > 22) return "Time to sleep"; // After 10pm
    }
  },
  components: {
    RecentPicks,
    StrikeRates,
    Highlights,
    Subscription,

  }
};
</script>
<style lang="scss">
@import "~assets/scss/breakpoints";
#greetings {
  margin-bottom: 70px;
}
.avatar {
  cursor: pointer;
}
.dashboard {
  .footy-radios {
    .custom-control {
      background: #ffffff;
      border: 2px solid #60b15a;
      box-sizing: border-box;
      border-radius: 12px;
      padding: 15px 16px;
    }
    .custom-control-input {
      position: relative;
    }
  }
  .nav-item {
    position: relative;
    .profile-down {
      position: absolute;
      top: 122px;
      position: absolute;
      min-height: 260px;
      background: #ffffff;
      border-radius: 10px;
      min-width: 390px;
      width: 100%;
      background: #ffffff;
      right: 0;
      background: #ffffff;
      border: 1px solid #eef5ed;
      box-sizing: border-box;
      box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      z-index: 2;
      padding: 20px;
      // bottom: 20px;
      .notification-header {
        h3 {
          font-weight: 600;
          font-size: 18px;
          line-height: 18px;
        }
        margin-bottom: 10px;
      }
      .notification-item {
        background: #eef5ed;
        border-radius: 4px;
        max-width: 358px;
        width: 100%;
        padding: 6px 12px;
        margin-bottom: 5px;
        h3,
        p {
          font-weight: 600;
          font-size: 12px;
          line-height: 18px;
        }
        p {
          color: #60685f;
        }
      }
    }
    .profile-img,
    .avatar-img {
      width: 102px;
      height: 102px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #f7f9f7;
      position: relative;
      .notification {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #dc6060;
        border: 2px solid #ffffff;
        box-sizing: border-box;
        border-radius: 50%;
        right: 8px;
        top: 8px;
      }
    }
  }
  .avatar-img {
    width: 102px;
    height: 102px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #f7f9f7;
  }

  .footy-page-description {
    font-weight: 600;
    font-size: 24px;
    line-height: 36px;
  }
}
@media (max-width: $lg) {
  .dashboard {
    .nav-item {
      .profile-down {
        top: -14px;
        right: -16px;
        min-width: 100vw;
        height: 100vh;
        overflow-y: auto;
        border: 1px solid #eef5ed;
        box-sizing: border-box;
        box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.05);
        border-radius: 0px;
      }
      .profile-img {
        width: 52px;
        height: 52px;
        display: flex;
        img {
          width: 14px;
          height: 14px;
        }
        .notification {
          width: 10px;
          height: 10px;
          right: 3px;
          top: 3px;
        }
      }
    }

    .footy-page-description {
      margin-left: 11px;
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      margin-top: 4px;
    }
  }
  #greetings {
    margin-bottom: 24px;
  }
}
</style>
