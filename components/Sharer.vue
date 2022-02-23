<template>
  <div v-if="filter" style="max-width : 500px; width: 100%;" id="view-strategy">
    <div v-if="viewMode">
      <h3>
        {{ filter.title }}
        <b-button
          variant="white"
          class="float-right rounded d-lg-none"
          @click="hideSharer"
        >
          <span class="material-icons"> close </span>
        </b-button>
      </h3>

      <h4 class="text-grey">{{ filter.note }}</h4>

      <div class="mb-3">
        <small class="extra-small">
          View the rules within a strategy and the hit / strike rate of it’s set
          outcome.
        </small>
      </div>
    </div>
    <div v-else>
      <h3>
        Share
      </h3>
      <h4 class="text-grey">{{ filter.title }}</h4>
      <h6 class="text-grey mb-2">Performance ( {{ filter.outcome.label }})</h6>
      <div class="mb-3">
        <small class="">
          Automated tracking on FootyAmigo.com started as of January 5th. You
          can take advantage of this with any new filter you make, allowing you
          to see how it would have performed across 1500+ leagues.
        </small>
      </div>
    </div>

    <!-- <div class="justify-between ">
      <h4>{{ filter.outcome.label }}</h4>
      <h4 class="text-primary">95.24% (1000/1050)</h4>
    </div>
    <b-progress
      :value="1000"
      :max="1050"
      show-progress
      variant="primary"
      class="rounded mb-4"
    ></b-progress> -->

    <h3 class="bigger-h3">
      {{
        filter.strategy_prematch_rules.length +
          filter.strategy_inplay_rules.length
      }}
      Rules & Settings
    </h3>
    <b-list-group class="my-3">
      <template v-if="$store.getters.lookupPreMatchRules">
        <b-list-group-item
          button
          v-for="(rule, i) in filter.strategy_prematch_rules"
          :key="i + 'prematch'"
          class="bg-white rounded-border py-2 px-3 h4"
          style="min-height: 60px"
          v-html="$getPreMatchPreview(rule, $store.getters.lookupPreMatchRules)"
        ></b-list-group-item>
      </template>
      <template v-if="$store.getters.lookupInPlayRules">
        <b-list-group-item
          button
          v-for="(rule, i) in filter.strategy_inplay_rules"
          :key="i + 'prematch'"
          class="bg-white rounded-border py-2 px-3 h4"
          style="min-height: 60px"
          v-html="
            $getInPlayPreview(
              rule,
              $store.getters.lookupInPlayRules
            )
          "
        ></b-list-group-item>
      </template>
    </b-list-group>
    <div v-if="!hideURL && !viewMode">
      <p>
        Share URL:
      </p>
      <a :href="shareLink" target="_blank">{{ shareLink }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean,
    id: Number,
    loading: Boolean,
    hideURL: Boolean,
    viewMode: Boolean
  },
  data() {
    return {
      filter: null
    };
  },
  mounted() {
    if (!this.$store.getters.lookupPreMatchRules) {
      this.$store.dispatch("fetchPreMatchRules");
    }
    if (!this.$store.getters.lookupInPlayRules) {
      this.$store.dispatch("fetchInPlayRules");
    }
    console.log("TEST MODE");
    this.getFilter(this.id);
  },
  methods: {
    async getFilter(id) {
      this.$emit("update:loading", true);
      const params = { id };
      const filter = await this.$axios.$get(`/user/strategies/id/`, {
        params
      });

      this.filter = filter;
      this.$emit("update:loading", false);
    },
    hideSharer() {
      this.showSharer = false;
    }
  },
  computed: {
    showSharer: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    shareLink() {
      if (this.filter) {
        return `https://dashboard.footyamigo.com/s/${this.filter.slug}/${this.filter.id}`;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
#share-modal___BV_modal_backdrop_ {
  background-color: white !important;
}
#view-strategy {
  .is-number {
    color: $primary;
  }
}
</style>
