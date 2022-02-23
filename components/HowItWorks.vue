<template>
  <div class="how-it-works">
    <div
      class="cursor-pointer"
      @click="getVideo"
      v-if="location != 'dashboard'"
    >
      <PlayIcon class="mr-2" />
      How it works
    </div>
    <div
      class="fullscreen-overlay"
      v-if="showVideo && video"
      @click.self="hideVideo"
      :class="showVideo ? 'show-video' : ''"
    >
      <div class="p-2 centered flex-col" style="width:100%; max-width: 800px; ">
        <b-button
          class="rounded-10 float-right mb-3"
          variant="transparent"
          size="sm"
          style="align-self: flex-end;"
          @click="hideVideo"
        >
          <span class="material-icons md-48 text-white">close</span>
        </b-button>

        <div
          v-html="video.video_url"
          style="width:100%; max-width: 800px;"
        ></div>
        <b-button
          class="rounded-10 float-right mt-3 text-white"
          variant="transparent"
          size="sm"
          v-if="location == 'dashboard'"
          style="align-self: flex-end;"
          @click="togglePrompt"
        >
          Don't show again
        </b-button>
        <PromptModal
          v-model="showPrompt"
          title="Hide Video Forever"
          message="Are you sure? This guide video will never be shown to you again. <br>Click continue to proceed or cancel if you want to watch it again later."
          @accepted="doNotShowIntro"
          :negative="true"
        >
        </PromptModal>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // value: Boolean,

    location: String,
    loading: Boolean
  },
  data() {
    return {
      video: null,
      showVideo: false,
      showPrompt: false
    };
  },
  mounted() {},
  methods: {
    async getVideo() {
      // this.$emit("update:loading", true);

      const video = await this.$axios.$get(
        `/user/page-videos/` + this.location
      );

      this.video = video;
      this.showVideo = true;
      // this.$emit("update:loading", false);
    },
    togglePrompt() {
      this.showPrompt = true;
    },
    async doNotShowIntro() {
      try {
        const res = await this.$axios.$post("/user/seen-intro");
        this.showVideo = false;
      } catch (error) {
        console.error(error);
      }
    },
    hideVideo() {
      this.showVideo = false;
    }
  }
  // computed: {
  //   showVideo: {
  //     get() {
  //       return this.value;
  //     },
  //     set(val) {
  //       this.$emit("input", val);
  //     }
  //   }
  // }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.how-it-works {
  font-weight: 600;
  font-size: 10px;
  display: flex;

  justify-content: center;

  line-height: 15px;
  color: $primary;
}

@media screen and (max-width: $lg) {
  .how-it-works {
    justify-content: flex-start;
  }
}

.fullscreen-overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8); /* Black background with opacity */
  z-index: 999; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
  &.show-video {
    display: flex;
  }
}
</style>
