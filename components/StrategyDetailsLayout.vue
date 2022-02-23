<template>
  <b-row>
    <b-col>
      <div class="p-lg-15">
        <section class="footy-page-header">
          <div class="footy-page-header-info">
            <div class="footy-page-title-wrapper" style="">
              <h3 class="footy-page-title " style="font-size: 26px;">
                {{ pageTitle }}
              </h3>
            </div>
            <h2
              class="footy-page-description text-warning"
              v-html="pageDescription"
              style="font-weight:500"
            ></h2>
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
export default {
  props: {
    pageTitle: String,
    pageDescription: String
  },
  data() {
    return {};
  }
};
</script>
