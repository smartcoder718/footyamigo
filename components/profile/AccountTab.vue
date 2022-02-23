<template>
  <b-row no-gutters class="account-tab ">
    <b-col md="6" sm="12">
      <b-form class="account-form">
        <div class="img-container">
          <b-button class="avatar mr-3">
            <img
              :src="`/svg/${form.avatar_id}.svg?inline`"
              alt=""
              class="avatar-active"
            />
          </b-button>

          <b-dropdown
            no-caret
            ref="uploadDropdown"
            toggle-class="footy-button"
            menu-class=""
            :dropup="showAvatars"
          >
            <template #button-content>
              <UploadIcon class="nav-icon-left" />
              <span class="text"> Change Avatar </span>
            </template>
            <b-dropdown-form @submit.stop.prevent>
              <div>
                <button class="btn" @click="toggleModal">
                  Select Avatar
                </button>
              </div>
            </b-dropdown-form>
            <b-overlay
              :show="loading"
              class="d-none d-lg-block"
              v-if="showAvatars"
            >
              <div class="avatars-container">
                <div class="avatars-inner">
                  <div
                    class="img"
                    @click="saveAvatar(avatar.id)"
                    v-for="(avatar, i) in avatars"
                    :key="i"
                  >
                    <img :src="avatar.src" alt="" />
                  </div>
                </div>
              </div>
            </b-overlay>
            <b-dropdown-form v-if="showAvatars"> </b-dropdown-form>

            <b-dropdown-form @submit.stop.prevent>
              <div>
                <button class="btn" @click="saveAvatar(0)">
                  Remove Photo
                </button>
              </div>
            </b-dropdown-form>
          </b-dropdown>
        </div>
        <b-form-group label="Email" label-for="email" class="footy-input-group">
          <b-form-input
            id="email"
            v-model="form.email"
            type="text"
            label="Email"
            name="email"
                class="footy-input"
            readonly
          ></b-form-input>
        </b-form-group>
        
        <b-form-group
          label="First Name"
          label-for="firstname"
          class="footy-input-group"
          description="Must be between than 3 and 20 characters"
        >
          <b-form-input
            id="firstname"
            name="firstname"
            v-model="form.firstname"
            type="text"
            label="First Name"
            class="footy-input"
            :state="firstnameState || form.firstname.length == 0"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Last Name"
          label-for="lastname"
          class="footy-input-group"
          description="Must be between than 3 and 20 characters"
        >
          <b-form-input
            id="lastname"
            name="lastname"
            v-model="form.lastname"
            type="text"
            class="footy-input"
            :state="lastnameState || form.lastname.length == 0"
            label="Last Name"
          ></b-form-input>
        </b-form-group>

        <b-button
          variant="primary"
          block
          class="footy-button"
          @click="saveDetails"
        >
          Save Details
        </b-button>
      </b-form>

      <!-- <modal
        @close="toggleModal"
        :showHeader="true"
        :modalActive="showAvatars"
      >
        
      </modal> -->

      <ModalOnMobile v-model="showAvatars">
        <b-overlay :show="loading" class="d-lg-none">
          <div class="avatars-container">
            <div class="avatars-inner">
              <div
                class="img"
                @click="saveAvatar(avatar.id)"
                v-for="(avatar, i) in avatars"
                :key="i"
              >
                <img :src="avatar.src" alt="" />
              </div>
            </div>
          </div>
        </b-overlay>
      </ModalOnMobile>
    </b-col>
  </b-row>
</template>

<script>
import UploadIcon from "~/static/icons/upload.svg";
// import { avatars } from "~/components/profile/profileavatars.js";
export default {
  data() {
    return {
      loading: false,
      showAvatars: false,
      form: {
        email: this.$auth.user.email,
        firstname: this.$auth.user.firstname,
        lastname: this.$auth.user.lastname,
        avatar_id: this.$auth.user.avatar_id
      }
    };
  },
  components: {
    UploadIcon
  },
  mounted() {},
  computed: {
    avatars() {
      const avatars = [];
      for (var i = 1; i <= 50; i++) {
        avatars.push({ src: `/svg/${i}.svg?inline`, id: i });
      }
      return avatars;
    },
    firstnameState() {
      return this.form.firstname.length >= 3 && this.form.firstname.length < 20;
    },
    lastnameState() {
      return this.form.lastname.length >= 3 && this.form.lastname.length < 20;
    }
  },
  methods: {
    toggleModal() {
      this.showAvatars = !this.showAvatars;
    },
    async saveDetails() {
      try {
        const profile = await this.$axios.$post(
          "/user/update-profile",
          this.form
        );
        this.$bvToast.toast(`Profile Updated`, {
          title: `Success!`,
          variant: "success",
          toaster: "b-toaster-top-center",
          solid: true
        });
        await this.$auth.fetchUser();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async saveAvatar(avatar_id) {
      try {
        // this.loading = true;
        // const params = { avatar_id };
        // const avatar = await this.$axios.$get("/user/change-avatar", {
        //   params
        // });
        // await this.$auth.fetchUser();
        // this.showAvatars = false;
        // console.log(avatar);
        this.form.avatar_id = avatar_id;
        this.showAvatars = false;
        await this.$auth.fetchUser();
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
.account-tab {
  .account-form {
    .img-container {
      margin-bottom: 40px;
      display: flex;
      align-items: center;

      .b-dropdown-form {
        padding: 0px;
        button {
          font-style: normal;
          font-weight: 600;
          padding: 17px;
          font-size: 17px;
          line-height: 18px;
          text-align: center;
          color: #374336;
          display: inline-block;
          width: 100%;
        }
      }
    }
  }
}
.avatars-container {
  max-width: $xl;
  width: 100%;
  margin: auto;
  height: 70vh;
  margin: 40px auto;
  overflow-y: auto;
  .avatars-inner {
    // display: grid;
    // // grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    // grid-template-columns: repeat(8, 150px);
    // row-gap: 20px;
    // column-gap: 20px;

    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    width: 100%;
    .img {
      cursor: pointer;
      min-width: 140px;
      min-height: 140px;
      max-width: 100%;
      flex: 1;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0px;
      img {
        width: 64px;
        height: 64px;
      }
    }
  }
}

@media (max-width: $lg) {
  .avatars-container {
    .avatars-inner {
      .img {
        min-width: 100px;
      }
    }
  }
}
@media (min-width: $lg) {
  .avatars-container {
    .avatars-inner {
      min-width: 800px;
    }
  }
}
</style>
