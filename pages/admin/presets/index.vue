<template>
  <b-row>
    <b-col cols="12">
      <footy-tab-select
        id="preset-type"
        :options="strategyTypes"
        v-model="strategyType"
      >
      </footy-tab-select>
      <b-table
        borderless
        responsive=""
        v-if="strategies"
        :items="strategies"
        :fields="fields"
      >
        togglePresetByAdmin
        <template #cell(active)="data">
          <footy-switch
            v-model="data.value"
            @click.native.prevent="toggleActiveStatus(data.item.id)"
          >
          </footy-switch>
        </template>

        <template #cell(is_public)="data">
          <footy-switch
            v-model="data.value"
            @click.native.prevent="togglePublicByAdmin(data.item.id)"
          >
          </footy-switch>
        </template>

        <template #cell(is_preset)="data">
          <footy-switch
            v-model="data.value"
            @click.native.prevent="togglePresetByAdmin(data.item.id)"
          >
          </footy-switch>
        </template>

        <template #cell(trusted)="data">
          <b-dropdown
            size="sm"
            class="footy-dropdown"
            :class="data.value ? '' : 'testing'"
            no-caret
          >
            <template slot="button-content">
              {{ data.value ? "Trusted" : "Testing" }}

              <span class="material-icons-outlined"> expand_more </span>
            </template>
            <b-dropdown-item @click="untrustStrategy(data.item.id)"
              >Testing</b-dropdown-item
            >
            <b-dropdown-item @click="trustStrategy(data.item.id)"
              >Trusted</b-dropdown-item
            >
          </b-dropdown>
        </template>
      </b-table>
    </b-col>
    <b-col>
      <MugenScroll
        :handler="fetchStrategies"
        :should-handle="!loading"
        v-if="!loaded"
      >
      </MugenScroll>
    </b-col>
  </b-row>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      strategies: [],
      strategyType: "in-play-alerts",
      strategyTypes: [
        { value: "in-play-alerts", text: "In Play Presets" },
        { value: "pre-match-alerts", text: "Pre Match Presets" }
      ],
      page: 1,
      loaded: false,
      loading: false,
      initialized: false,
      fields: [
        "title",
        "is_public",
        "is_preset",
        "hit_rate",
        "trusted",
        "actions",
        "active"
      ]
    };
  },
  watch: {
    strategyType() {
      this.strategies = [];
      this.loaded = false;
      this.page = 1;
      this.fetchStrategies();
    }
  },
  beforeMount() {
    this.fetchStrategies();
  },

  methods: {
    async fetchStrategies() {
      try {
        this.loading = true;

        var strategies = await this.$axios.fetchAdminStrategies({
          type: this.strategyType,
          page: this.page
        });
        this.page += 1;
        this.strategies.push(...strategies);
        window.scrollBy(0, -200);
        this.loading = false;
        if (strategies.length < 10) {
          this.loaded = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },

    async trustStrategy(id) {
      await this.$axios.trustStrategy(id);
      this.fetchStrategies();
    },

    async untrustStrategy(id) {
      await this.$axios.untrustStrategy(id);
      this.fetchStrategies();
    },
    async toggleActiveStatus(id) {
      await this.$axios.toggleActiveStatus(id);
      this.fetchStrategies();
    },
    async togglePresetByAdmin(id) {
      await this.$axios.togglePresetByAdmin(id);
      this.fetchStrategies();
    },

    async togglePublicByAdmin(id) {
      await this.$axios.togglePublicByAdmin(id);
      this.fetchStrategies();
    }
  }
};
</script>

<style></style>
