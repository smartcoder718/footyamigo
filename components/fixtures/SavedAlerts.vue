<template>
  <b-tab class="saved-rules">
    <template #title>
      <h3 class="tab-title">Saved</h3>
    </template>
    <b-tabs>
      <b-tab active class="trusted-rules">
        <template #title>
          <h3 class="tab-title">Trusted</h3>
        </template>
        <div class="rules trusted">
          <template v-for="(alert, i) in alerts">
            <div class="rule" v-if="alert.trusted" :key="i">
              <h3>
                {{ alert.title }}
              </h3>
              <div class="action-btns">
                <b-button>Edit</b-button>
                <b-button class="use-btn">Use</b-button>
              </div>
            </div>
          </template>
        </div>
      </b-tab>
      <b-tab class="testing-rules">
        <template #title>
          <h3 class="tab-title">Testing</h3>
        </template>
        <div class="rules trusted">
          <template v-for="(alert, i) in alerts">
            <div class="rule" v-if="!alert.trusted" :key="i">
              <h3>
                {{ alert.title }}
              </h3>
              <div class="action-btns">
                <b-button>Edit</b-button>
                <b-button class="use-btn">Use</b-button>
              </div>
            </div>
          </template>
        </div>
      </b-tab>
    </b-tabs>
  </b-tab>
</template>

<script>
export default {
  props: {
    // alert: Array,
  },
  mounted() {
    this.getPreMatchStrategies();
  },
  methods: {
    async getPreMatchStrategies() {
      var alerts = await this.$axios.getPreMatchStrategies();
      this.alerts = alerts;
    },
  },
  data() {
    return {
      alerts: null,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>