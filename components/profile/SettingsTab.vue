<template>
  <div class="d-grid gap-20 setting-tab" style="max-width: 720px">
    <h3>Alert Settings</h3>
    <h6>
      <!-- Connect your Telegram account to start recieving Match Alerts from Footy
      Amigo on the go! Its fast and instant. -->
      Download the Footy Amigo app to start recieving Match Alerts from your
      PreMatch & InPlay Strategies on the go! Its fast and instant. You will
      directed to the Google Play Store (if you are on a andriod device) or the
      iOS appstore (if you are on an iOS device)
    </h6>
    <div class="telegram-and-refresh">
      <div class="telegram">
        <div
          class="telegram-inner d-flex justify-content-between align-items-start w-100 wrap-on-mobile"
        >
          <div class="d-flex align-items-center">
            <b-img
              fluid
              class="telegram-logo"
              style="width: 80px"
              src="/vectors/amigo.png"
            />

            <div>
              <div class="sub-heading mb-2">FootyAmigo Alerts</div>
              <footy-switch
                @click.native.prevent=""
                :value="$auth.user.phone ? true : false"
              ></footy-switch>
            </div>
          </div>

          <b-button
            class="footy-button w-100-mobile"
            v-if="$auth.user.phone"
            variant="primary"
            style="align-self: center"
          >
            Connected</b-button
          >
          <!-- @click="deassociateTelegram" -->
          <b-button
            class="footy-button w-100-mobile"
            v-else
            target="_blank"
            @click="downloadApp"
            style="align-self: center"
            >Connect
          </b-button>
        </div>
      </div>
      <div class="centered">
        <b-button
          class="text-white refresh-connection-button"
          variant="warning"
          v-if="tabOpened"
          @click="refreshUser"
        >
          Refresh connection status
          <b-spinner small v-if="loading" variant="white"> </b-spinner>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import TelegramLogo from "~/static/vectors/amigo.svg";
export default {
  methods: {},
  data() {
    return {
      loading: false,
      tabOpened: false,
      checkConnectionInterval: null,
    };
  },
  components: {
    TelegramLogo,
  },
  props: {
    tabIndex: Number,
  },
  beforeDestroy() {
    clearInterval(this.checkConnectionInterval);
  },
  methods: {
    async refreshUser() {
      try {
        this.loading = true;
        await this.$auth.fetchUser();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        if (this.$auth.user.phone) {
          this.tabOpened = false;
        }
      }
    },
    async downloadApp() {
      const playStore =
        "https://play.google.com/store/apps/details?id=com.footyamigo";
      const appStore = "https://apps.apple.com/in/app/footy-amigo/id1600332131";
      if (
        navigator.userAgent.toLowerCase().indexOf("iphone") > -1 ||
        navigator.userAgent.toLowerCase().indexOf("Macintosh") > -1
      ) {
        window.open(appStore, "_blank");
      } else {
        window.open(playStore, "_blank");
      }
      this.tabOpened = true;
      const instance = this;
      // clearInterval(this.checkConnectionInterval);
      // this.checkConnectionInterval = setInterval(async () => {
      //   await instance.$auth.fetchUser();
      //   if (instance.$auth.user.phone) {
      //     clearInterval(instance.checkConnectionInterval);
      //     instance.tabOpened = false;
      //   }
      // }, 2500);
    },
  },
};
</script>

<style lang="scss">
.telegram {
  padding: 30px 38px;
  display: flex;
  border: 1px solid #f0f1f0;
  align-items: center;
  width: 100%;
  max-width: 488px;

  justify-content: space-between;
  .telegram-logo {
    margin-right: 16px;
  }
}
.refresh-connection-button {
  font-weight: 500;
  // font-family: Poppins;
  padding: 5px 12px;
  border-radius: 4px;
}
.setting-tab {
  margin-top: 32px;

  .sub-heading-2,
  .sub-heading {
    font-size: 24px;
    line-height: 36px;
    margin-bottom: 20px;

    font-weight: 600;
    color: #11142d;
  }
  .connect-disconnect {
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
  }
  .sub-heading {
    font-size: 16px;
    line-height: 24px;
  }
  .telegram-and-refresh {
    max-width: 488px;
    display: grid;
    gap: 20px;
    .telegram {
      background: #ffffff;
      border: 1px solid #f0f1f0;
      padding: 30px;
      max-width: 488px;
      width: 100%;
      .telegram-inner {
        width: 100%;
      }
    }
  }
}
</style>
