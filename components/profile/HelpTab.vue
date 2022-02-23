<template>
  <div class="help-tab">
    <div class="help-radio-wrapper bg-light">
      <b-img fluid src="/vectors/dogthumbs.svg" class="mb-3 d-none d-lg-block">
      </b-img>
      <div class="support">
        <div>
          <h3 class="mb-3">Amigo Support 🚀</h3>
          <h6 class="my-3 text-grey fw-normal">
            Here you can find everything you need from support, to our continous
            changes, updates and our forward thinking product roadmap.
          </h6>
        </div>
        <div>
          <b-img
            src="/vectors/dogthumbs.svg"
            class="mb-3 dog-thumbs d-lg-none"
            style="width: 56px"
          >
          </b-img>
        </div>
      </div>
      <div>
        <footy-radio
          v-model="activeTab"
          :options="tabs"
          containerClass="wrap-on-lg scroll-on-mobile"
          radioClass="w-100"
        ></footy-radio>
      </div>
    </div>
    <div class="help-content-wrapper">
      <component :is="activeTabComponent"> </component>
    </div>
  </div>
</template>

<script>
import DogImage from "~/static/vectors/question.svg";
import Chat from "./help-tabs/Chat";
import ChangeLog from "./help-tabs/ChangeLog";
import RoadMap from "./help-tabs/RoadMap";
import VideoTutorials from "./help-tabs/VideoTutorials";

export default {
  methods: {},
  components: { DogImage },
  props: {
    tabIndex: Number,
  },
  data() {
    return {
      activeTab: "chat",
      tabs: [
        { value: "chat", text: "Start Live Chat" },
        { value: "videos", text: "Video Tutorials" },
        { value: "changelog", text: "Change Log Updates" },
        { value: "roadmap", text: "Product Roadmap" },
      ],
    };
  },
  computed: {
    activeTabComponent() {
      const tabs = {
        chat: Chat,
        changelog: ChangeLog,
        roadmap: RoadMap,
        videos: VideoTutorials,
      };
      return tabs[this.activeTab];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/breakpoints";
.help-tab {
  display: flex;

  gap: 36px;
}
.help-radio-wrapper {
  padding: 20px;
  max-width: 309px;
  border-radius: 12px;
}
.help-content-wrapper {
  display: grid;
  gap: 16px;
  align-content: flex-start;
  padding-top: 60px;
}
.custom-dog-question {
  svg {
    max-width: 60%;
  }
}
@media screen and (min-width: $lg) {
  .help-radio-wrapper {
    min-height: 709px;
  }
}
@media screen and (max-width: $lg) {
  .help-tab {
    flex-direction: column;
    .help-content-wrapper {
      padding-top: 0px;
      padding: 10px;
    }
    .help-radio-wrapper {
      max-width: 100%;

      overflow: hidden;
      gap: 12px;
      flex-grow: 0;
      // .dog-thumbs {
      //   display: block;
      // }
      .support {
        flex: 1;
        display: flex;
      }
    }
  }
  .custom-dog-question {
    svg {
      max-width: 30%;
    }
  }
}
</style>
