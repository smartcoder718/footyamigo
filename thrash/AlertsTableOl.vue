<template>
  <div>
    <!-- <div class="show-upgrade">
      <b-img
        class="img mb-4"
        src="/vectors/pro.svg"
        fluid
        height="85"
        width="85"
      >
      </b-img>
      <h1 class="header-size-1">
        Pro Subscription
      </h1>

      <h6 class="text-grey mb-1">
        Upgrade to Pro version to see the content
      </h6>
      <b-button
        class="footy-button footy-button-xs"
        variant="primary"
        to="/profile/subscription"
      >
        Upgrade to Pro
      </b-button>
    </div> -->
    <!-- Desktop -->
    <section
      class="page-strategies d-flex align-items-center justify-content-between"
    >
      <h4 class="mb-3">{{ strategies.length }} Strategies</h4>
      <div class="sort-lists d-flex column-gap-10">
        <div class="sort-item">
          <b-dropdown size="sm" class="footy-dropdown" no-caret>
            <template slot="button-content">
              Type:

              <span>
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L5 5L1 1"
                    stroke="#222622"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </template>
            <b-dropdown-item
              v-for="(type, i) in types"
              :key="i"
              @click="toggleType(type)"
            >
              {{ type }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="sort-item">
          <b-dropdown size="sm" class="footy-dropdown" no-caret>
            <template slot="button-content">
              Sort:

              <span>
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L5 5L1 1"
                    stroke="#222622"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </template>
            <b-dropdown-item
              v-for="(sort, i) in sortList"
              :key="i"
              @click="toggleSort(sort)"
            >
              {{ sort }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </section>
    <section class="d-none d-lg-block">
      <b-table
        borderless
        hover
        :items="strategies"
        :fields="fields"
        id="datatable"
        class="alerts-table"
        :thead-tr-class="'text-uppercase'"
        :tbody-tr-class="'table-body-row'"
      >
        <template #cell(title)="data">
          <div class="ellipsis-2-lines">
            {{ data.value }}
          </div>
        </template>
        <template #cell(updated_at)="data">
          <span :class="data.value">
            {{ $moment(data.value).format("ddd MMM D YYYY") }}
          </span>
        </template>

        <template #cell(hit_rate)="data">
          <span :class="$getColor(data.value, 'text-')"> {{ data.value }}% </span>
        </template>
        <template #cell(strike_rate)="data">
          <span :class="$getColor(data.value, 'text-')"> {{ data.value }}% </span>
        </template>
        <template #cell(outcome)="data">
          <div class="ellipsis-2-lines">
            {{ data.value.label }}
          </div>
        </template>

        <template #cell(active)="data">
          <footy-switch
            v-model="data.value"
            @click.native.prevent="toggleActiveStatus(data.item.id, data.index)"
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
            <b-dropdown-item @click="untrustStrategy(data.item.id, data.index)"
              >Testing</b-dropdown-item
            >
            <b-dropdown-item @click="trustStrategy(data.item.id, data.index)"
              >Trusted</b-dropdown-item
            >
          </b-dropdown>
        </template>

        <template #cell(actions)="data" v-if="strategyMode == 'my-alerts'">
          <b-dropdown
            size="sm"
            text="View"
            no-caret
            class="actions-dropdown multiactions-btn"
          >
            <template slot="button-content">
              <!-- @click="$router.push(`/${data.item.id}/${type}/results`)" -->
              <div class="view-text" @click="viewFilter(data.item.id)">
                View
              </div>
              <span class="btn-icon">
                <svg
                  width="11"
                  height="6"
                  viewBox="0 0 11 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.66602 1L5.66602 5L1.66602 1"
                    stroke="#222622"
                    stroke-opacity="0.5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </template>
            <b-dropdown-item
              v-if="edited"
              @click="editAlert(data.item.id, data.item)"
              >Edit</b-dropdown-item
            >
            <b-dropdown-item v-else :to="`/${type}/edit/${data.item.id}`"
              >Edit</b-dropdown-item
            >

            <b-dropdown-item
              :to="`/${type}/results/${data.item.id}`"
              v-if="strategyType == 'pre-match-alerts'"
              >Results</b-dropdown-item
            >
            <b-dropdown-item :to="`/${type}/picks/${data.item.id}`"
              >Picks</b-dropdown-item
            >
            <!-- <b-dropdown-item href="#">Track</b-dropdown-item> -->
            <b-dropdown-item @click="cloneStrategy(data.item.id)"
              >Clone</b-dropdown-item
            >
            <b-dropdown-item @click="shareFilter(data.item.id)"
              >Share</b-dropdown-item
            >
            <b-dropdown-item
              @click="deleteStrategy(data.item.id, data.index)"
              variant="danger"
              active-class="bg-dangerous"
              link-class="bg-dangerous"
              class="bg-white"
            >
              Delete
            </b-dropdown-item>
          </b-dropdown>
        </template>
        <template #cell(actions)="data" v-else>
          <div class="footy-button-group">
            <b-button class="footy-button" @click="viewFilter(data.item.id)">
              View
            </b-button>
            <template> </template>
            <b-overlay :show="loading[data.item.id]" class="p-0">
              <b-button
                class="footy-button "
                style="min-width: 162.54px;"
                v-if="imported[data.item.id]"
                variant="primary"
              >
                Imported
              </b-button>
              <b-button
                class="footy-button"
                @click="importStrategy(data.item.id)"
                v-else
              >
                Import Strategy
              </b-button>
            </b-overlay>
          </div>
        </template>
      </b-table>
    </section>
    <!-- Mobile -->
    <section class="d-block d-lg-none">
      <div
        class="mobile-table-container"
        v-for="(filter, i) in strategies"
        :key="i"
      >
        <b-row no-gutters>
          <b-col cols="6">
            <div class="field">
              <h3 class="title">Strategy Name</h3>
              <h6 class="value">{{ filter.title }}</h6>
            </div>
            <div class="field">
              <h3 class="title">Picks Sent</h3>
              <h6 class="value">{{ filter.picks_sent }}</h6>
            </div>
            <div class="field">
              <h3 class="title">status</h3>
              <b-dropdown
                size="sm"
                class="footy-dropdown"
                :class="filter.trusted ? 'trusted' : 'testing'"
                no-caret
              >
                <template slot="button-content">
                  {{ filter.trusted ? "Trusted" : "Testing" }}

                  <span class="material-icons-outlined"> expand_more </span>
                </template>
                <b-dropdown-item @click="untrustStrategy(filter.id, i)"
                  >Testing</b-dropdown-item
                >
                <b-dropdown-item @click="trustStrategy(filter.id, i)"
                  >Trusted</b-dropdown-item
                >
              </b-dropdown>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="field" v-if="strategyType == 'pre-match-alerts'">
              <h3 class="title">Hit Rate</h3>
              <h6 class="" :class="[getColor(filter.hit_rate), 'value']">
                {{ filter.hit_rate }}%
              </h6>
            </div>
            <div class="field" v-else>
              <h3 class="title">Strike Rate</h3>
              <h6 class="" :class="[getColor(filter.strike_rate), 'value']">
                {{ filter.strike_rate }}%
              </h6>
            </div>
            <div class="field">
              <h3 class="title">last edited</h3>
              <h6 class="value">
                {{ $moment(filter.updated_at).format("ddd MMM D YYYY") }}
              </h6>
            </div>
            <div class="field">
              <h3 class="title">active</h3>
              <footy-switch
                v-model="filter.active"
                @click.native.prevent="toggleActiveStatus(filter.id, i)"
              >
              </footy-switch>
            </div>
          </b-col>
        </b-row>
        <b-row no-gutters>
          <b-col cols="12">
            <b-dropdown
              size="sm"
              class="view-btn multiactions-btn"
              no-caret
              text="Right align"
              v-if="strategyMode == 'my-alerts'"
            >
              <template slot="button-content">
                <!-- @click="$router.push(`/${filter.id}/${type}/results`)" -->
                <div class="view-text" @click="viewFilter(filter.id)">
                  View
                </div>
                <span class="btn-icon">
                  <svg
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.66602 1L5.66602 5L1.66602 1"
                      stroke="#222622"
                      stroke-opacity="0.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </template>
              <b-dropdown-item
                v-if="edited"
                @click="editAlert(filter.id, filter)"
                >Edit</b-dropdown-item
              >
              <b-dropdown-item v-else :to="`/${type}/edit/${filter.id}`"
                >Edit</b-dropdown-item
              >

              <b-dropdown-item
                :to="`/${type}/results/${filter.id}`"
                v-if="strategyType == 'pre-match-alerts'"
                >Results</b-dropdown-item
              >
              <b-dropdown-item :to="`/${type}/picks/${filter.id}`"
                >Picks</b-dropdown-item
              >
              <!-- <b-dropdown-item href="#">Track</b-dropdown-item> -->
              <b-dropdown-item @click="cloneStrategy(filter.id)"
                >Clone</b-dropdown-item
              >
              <b-dropdown-item @click="shareFilter(filter.id)"
                >Share</b-dropdown-item
              >
              <b-dropdown-item
                @click="deleteStrategy(filter.id, i)"
                variant="dangerous"
              >
                <span class="text-danger">Delete </span>
              </b-dropdown-item>
            </b-dropdown>
            <template v-else>
              <div class="footy-button-group wrap-on-mobile">
                <b-button
                  class="footy-button"
                  block
                  @click="viewFilter(data.item.id)"
                >
                  View
                </b-button>
                <template> </template>
                <b-overlay :show="loading[filter.id]" class="p-0">
                  <b-button
                    class="footy-button "
                    style="min-width: 162.54px;"
                    v-if="imported[filter.id]"
                    variant="primary"
                    block
                  >
                    Imported
                  </b-button>
                  <b-button
                    class="footy-button"
                    @click="importStrategy(filter.id)"
                    v-else
                    block
                  >
                    Import Strategy
                  </b-button>
                </b-overlay>
              </div>
            </template>
          </b-col>
        </b-row>
      </div>
    </section>
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
function fields(strategyType, strategyMode) {
  const fields = {
    "my-alerts": [
      { key: "title", label: "Strategy name" },
      strategyType == "pre-match-alerts" ? "hit_rate" : "strike_rate",
      "picks_sent",
      { key: "updated_at", label: "Last edited" },
      { key: "trusted", label: "Status" },
      "active",
      "actions"
    ],
    "explore-alerts": [
      { key: "title", label: "Strategy name" },
      strategyType == "pre-match-alerts" ? "hit_rate" : "strike_rate",
      "outcome",
      { key: "trusted", label: "Status" },
      "actions"
    ],
    "preset-alerts": [
      { key: "title", label: "Strategy name" },
      strategyType == "pre-match-alerts" ? "hit_rate" : "strike_rate",
      "outcome",
      { key: "trusted", label: "Status" },
      "actions"
    ]
  };
  return fields[strategyMode];
}

export default {
  props: {
    strategies: Array,
    type: String,
    selectedType: String,
    selectedSort: String,
    strategyMode: String,
    strategyType: String,
    edited: Boolean
  },
  components: {
    SharerModal
  },
  data() {
    return {
      showSharer: false,
      strategyId: null,
      showStrategy: false,

      fields: fields(this.strategyType, this.strategyMode),
      types: ["All", "Active", "Inactive"],
      imported: {},
      loading: {},
      sortList: ["Name", "Hit Rate", "Picks Sent", "Last Edited"]
    };
  },
  methods: {
    getColor(num) {
      if (num > 70) {
        return "text-primary";
      } else if (num > 30) {
        return "text-warning";
      } else {
        return "text-danger";
      }
    },
    editAlert(id, value) {
      console.log(value);
      this.$router.push({
        path: `/${this.type}/edit/${id}`
      });
    },
    async deleteStrategy(id, index) {
      if (confirm("Are you sure you want to delete this filter?")) {
        await this.$axios.deleteStrategy(id);
        this.strategies.splice(index, 1);
      }
    },
    shareFilter(id) {
      this.showSharer = true;
      this.strategyId = id;
    },
    toggleType(value) {
      this.$emit("toggleType", value);
    },
    toggleSort(value) {
      this.$emit("toggleSort", value);
    },
    editFilter(id) {
      this.$emit("editFilter", id);
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
    async importStrategy(id) {
      try {
        this.$set(this.loading, id, true);
        await this.$axios.importStrategy(id);
        this.$set(this.imported, id, true);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading[id] = false;
      }
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
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";

.alerts-table {
  tr {
    border: 1px solid #f0f1f0;
  }
  th {
    padding: 16px 24px;
    color: $grey;
  }
  // td {
  //   padding: 20px 24px;
  // }
}
</style>
