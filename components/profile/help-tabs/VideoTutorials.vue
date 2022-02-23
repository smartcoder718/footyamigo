<template>
  <div class="video-tutorials-videos">
    <h3>How-To Videos 📹</h3>
    <h6 class="fw-normal text-grey">
      Here are some video tutorials to help you get the best out of Footy Amigo.
      Tips, Tricks, Sample Strategies and more so that you have everything you
      need to beat the bookies daily. (Click the arrow to see more videos)
    </h6>

    <div class="video-tutorials-items">
      <!-- <div class="px-5 mb-3">

       <carousel
          v-model="activeIndex"
          :perPage="1"
          :minSwipeDistance="50"
          :navigationEnabled="true"
          :paginationEnabled="false"
          paginationColor="#f7f9f7"
          navigationNextLabel="<span class='material-icons-outlined arrow-button'>arrow_forward_ios</span>"
          navigationPrevLabel="<span class='material-icons-outlined'>arrow_back_ios</span>"
        >
          <slide
            v-for="(option, index) in videos"
            :key="index"
            class="centered"
          >
            <div class="px-1 text-center">
              <h3
                class="tutorial-video-title"
                block
                @click="activeIndex = index"
                :class="activeIndex == index ? 'text-primary' : ''"
              >
                {{ option.title }}
              </h3>
            </div>
          </slide>
        </carousel> 
      </div> -->
      <div class="help-slider pb-2 px-2">
        <div>
          <b-button
            variant="transparent"
            @click="prevSlide"
            :disabled="activeIndex == 0"
          >
            <span class="material-icons-outlined">arrow_back_ios</span>
          </b-button>
        </div>
        <div
          v-for="(option, index) in videos"
          :key="index"
          class="centered animate__animated animate__faster "
          :class="[
            activeIndex != index ? 'hidden' : '',
           
          ]"
        >
          <div class="px-1 text-center">
            <h3
              class="tutorial-video-title"
              block
              @click="activeIndex = index"
              :class="activeIndex == index ? 'text-primary' : ''"
            >
              {{ option.title }}
            </h3>
          </div>
        </div>
        <div>
          <b-button
            variant="transparent"
            @click="nextSlide"
            :disabled="activeIndex == videos.length - 1"
          >
            <span class="material-icons-outlined arrow-button"
              >arrow_forward_ios</span
            >
          </b-button>
        </div>
      </div>
      <div
        v-for="(option, index) in videos"
        :key="index"
        v-html="option.video_url"
        class=" animate__animated animate__faster"
        :class="[
          activeIndex != index ? 'hidden' : '',
          right ? 'animate__slideInRight' : 'animate__slideInLeft',
        ]"
      >
       
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";

export default {
  data() {
    return {
      loading: false,
      loaded: false,
      videos: [],
      page: 1,
      activeIndex: 0,
      videos: [],
      right: 1,
    };
  },
  components: {
    Carousel,
    Slide,

  },
  mounted() {
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      try {
        this.loading = true;
        const videos = await this.$axios.$get("/user/page-videos/help");
        this.videos = videos;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    nextSlide() {
      this.right = 1;
      this.activeIndex++;
    },
    prevSlide() {
      this.right = 0;
      this.activeIndex--;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.video-tutorials-videos {
  display: grid;
  gap: 16px;
  align-content: flex-start;

  max-width: 549px;
  .help-slider {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .hidden {
    display: none;
  }
  h3.tutorial-video-title {
    font-size: 22px;
    line-height: 28px;
  }
  .video-tutorials-items-background {
    border-radius: 12px;
  }
  .video-tutorials-items {
    padding: 23px 23px;
    border: 1px solid #d5ded5;
    background: white;
    box-sizing: border-box;
    border-radius: 12px;
    display: grid;
    min-height: 300px;

    overflow-y: auto;
    .video-tutorials-item {
      padding: 12px 0px;
      border-bottom: 3px solid $lightgrey;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
@media screen and (max-width: $lg) {
  .video-tutorials-videos {
    h3.tutorial-video-title {
      font-size: 16px;
      line-height: 24px;
    }
    .video-tutorials-items {
      padding: 20px 16px;
    }
  }
}
</style>
