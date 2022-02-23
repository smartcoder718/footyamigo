<template>
  <div>
    <section
      class="page-strategies d-flex align-items-center justify-content-between"
    >
      <h4 class="mb-3">{{ total }} Strategies</h4>
      <div class="sort-lists d-flex column-gap-10">
        <div class="sort-item">
          <SmallDropdown :options="typeList" v-model="type" label="Type" />
        </div>

        <div class="sort-item">
          <SmallDropdown :options="sortList" v-model="sort" label="Sort" />
        </div>
      </div>
    </section>

    <UpgradeToPro :message="upgradeMessage" :showUpgrade="showUpgrade">
      <MyAlertsTable
        :strategies="strategies"
        :strategyType="strategyType"
        @viewfilter="viewFilter"
        @deleteStrategy="deleteStrategy"
        @sharefilter="shareFilter"
        @refetchTable="$emit('refetchTable')"
        v-if="strategyMode == 'my-alerts'"
      />
      <ExploreAlertsTable
        :strategies="strategies"
        :strategyType="strategyType"
        @viewfilter="viewFilter"
        v-else
        :strategyMode="strategyMode"
      />
    </UpgradeToPro>

    <SharerModal v-model="showSharer" :id="strategyId" v-if="showSharer">
    </SharerModal>
    <SharerModal
      v-model="showStrategy"
      :id="strategyId"
      v-if="showStrategy"
      :viewMode="true"
    >
    </SharerModal>
  </div>
</template>

<script>
import SharerModal from "~/components/SharerModal";
import MyAlertsTable from "~/components/strategy-list/MyAlertsTable";
import ExploreAlertsTable from "~/components/strategy-list/ExploreAlertsTable";

export default {
  props: {
    strategies: Array,

    selectedType: String,
    selectedSort: String,
    strategyMode: String,
    strategyType: String,
    edited: Boolean,
    showUpgrade: Boolean,
    total: Number,
  },
  components: {
    SharerModal,
    MyAlertsTable,
    ExploreAlertsTable,
  },
  data() {
    return {
      showSharer: false,
      strategyId: null,
      showStrategy: false,
      typeList: [
        { value: "all", text: "All" },
        { value: "active", text: "Active" },
        { value: "inactive", text: "Inactive" },
      ],
      sortList: [
        { value: "status", text: "Status" },
        { value: "name", text: "Name" },
        { value: "updated_at", text: "Last Edited" },
        {
          value: "hit_rate",
          text:
            this.strategyType == "in-play-alerts" ? "Strike Rate" : "Hit Rate",
        },
        { value: "picks_sent", text: "Picks Sent" },
      ],
    };
  },
  computed: {
    upgradeMessage() {
      const messages = {
        "my-alerts": "Upgrade to Pro to regain access to your strategies",
        "explore-alerts":
          "Upgrade to Pro to gain access to strategies from 100s of profitable users",
        "preset-alerts":
          "Upgrade to Pro to gain access to tested and trusted profitable preset strategies",
      };
      return messages[this.strategyMode];
    },
    sort: {
      get() {
        return this.selectedSort;
      },
      set(value) {
        this.$emit("update:selectedSort", value);
      },
    },
    type: {
      get() {
        return this.selectedType;
      },
      set(value) {
        this.$emit("update:selectedType", value);
      },
    },
  },
  methods: {
    async deleteStrategy(id) {
      this.$emit("deleteStrategy", id);
    },

    shareFilter(id) {
      this.showSharer = true;
      this.strategyId = id;
    },

    refreshTable() {
      this.$emit("refreshTable");
    },

    viewFilter(id) {
      this.showStrategy = true;
      this.strategyId = id;
    },
    async trustStrategy(id, index) {
      await this.$axios.trustStrategy(id);
      // this.refreshTable();
      this.strategies[index].trusted = true;
    },
    async cloneStrategy(id) {
      await this.$axios.cloneStrategy(id);
      this.refreshTable();
    },
    async untrustStrategy(id, index) {
      await this.$axios.untrustStrategy(id);
      // const index = this.strategies.findIndex( strategy => strategy.id > id);
      this.strategies[index].trusted = false;
      // this.refreshTable();
    },
    async toggleActiveStatus(id, index) {
      await this.$axios.toggleActiveStatus(id);
      this.strategies[index].active = !this.strategies[index].active;
    },
  },
};
</script>

<style>
.alerts-table {
  /* font-weight: 500; */
}
</style>
