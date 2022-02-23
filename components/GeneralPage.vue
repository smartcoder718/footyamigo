<template>
  <b-row>
    <b-col>
      <div class="p-lg-15">
        <section class="footy-page-header " :class="extraHeaderClass">
          <slot name="avatar"> </slot>
          <div class="footy-page-header-info ">
            <div class="footy-page-title-wrapper">
              <div class="d-flex align-items-center">
                <h1 class="footy-page-title" v-html="pageTitle"></h1> 
                <div class="how-it-works ml-5">
                  <slot name="howItWorks">
                    <PlayIcon class="mr-2" />
                    How it works?
                  </slot>
                </div>
              </div>
            </div>

            <h2 class="footy-page-description" v-html="pageDescription"></h2>
          </div>
          <div class="footy-page-header-buttons">
            <slot name="pageButton"> </slot>
          </div>
        </section>

        <slot> </slot>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import PlayIcon from "~/static/icons/play.svg";

export default {
  props: {
    pageTitle: String,
    pageDescription: String,
    extraHeaderClass: String
  },
  data() {
    return {};
  },

  components: {
    PlayIcon
  }
};
</script>
