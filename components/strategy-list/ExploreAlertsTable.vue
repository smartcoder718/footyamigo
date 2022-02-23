<template>
  <div class="explore-alerts-table">
    <template v-if="strategies.length">
      <div class="explore-alerts-table-head explore-alerts-table-row text-grey">
        <div>STRATEGY NAME</div>
        <div>
          {{
            strategyMode == "preset-alerts"
              ? "PICKS SENT"
              : strategyType == "pre-match-alerts"
              ? "HIT RATE"
              : "STRIKE RATE"
          }}
        </div>
        <div>OUTCOME</div>
        <div>STATUS</div>
        <div>ACTIONS</div>
      </div>

      <div
        v-for="(item, index) in strategies"
        :key="index"
        class="explore-alerts-table-row"
      >
        <div class="strategy-name-item explore-alerts-table-item">
          <div class="explore-alerts-table-label">STRATEGY NAME</div>
          <div class="explore-alerts-item-value">
            <div class="ellipsis-2-lines">
              {{ item.title }}
            </div>
          </div>
        </div>

        <div class="hit-rate-item explore-alerts-table-item">
          <div class="explore-alerts-table-label">
            {{
              strategyMode == "preset-alerts"
                ? "PICKS SENT"
                : strategyType == "pre-match-alerts"
                ? "HIT RATE"
                : "STRIKE RATE"
            }}
          </div>
          <div
            class="my-alerts-item-value"
            v-if="strategyMode == 'preset-alerts'"
          >
            {{ item.picks_sent }}
          </div>
          <div
            class="my-alerts-item-value"
            v-else-if="strategyType == 'pre-match-alerts'"
          >
            <span :class="$getColor(item.hit_rate, 'text-')">
              {{ "NA" }}%
            </span>
          </div>
          <div class="my-alerts-item-value" v-else>
            <span :class="$getColor(item.strike_rate, 'text-')">
              {{ item.strike_rate }}%
            </span>
          </div>
        </div>

        <div class="outcome-item explore-alerts-table-item">
          <div class="explore-alerts-table-label">OUTCOME</div>
          <div class="explore-alerts-item-value">
            <div class="ellipsis-2-lines">
              {{ item.outcome.label }}
            </div>
          </div>
        </div>

        <div class="status-item explore-alerts-table-item">
          <div class="explore-alerts-table-label">STATUS</div>
          <div class="explore-alerts-item-value">
            <b-dropdown
              size="sm"
              class="footy-dropdown"
              :class="item.trusted ? '' : 'testing'"
              no-caret
            >
              <template slot="button-content">
                {{ item.trusted ? "Trusted" : "Testing" }}
              </template>
            </b-dropdown>
          </div>
        </div>

        <div class="actions-item explore-alerts-table-item">
          <div class="explore-alerts-item-value">
            <div class="footy-button-group wrap-on-mobile">
              <b-button
                class="footy-button"
                @click="$emit('viewfilter', item.id)"
              >
                View
              </b-button>
              <template> </template>
              <b-overlay :show="loading[item.id]" class="p-0">
                <b-button
                  class="footy-button"
                  style="min-width: 162.54px"
                  v-if="imported[item.id]"
                  variant="primary"
                >
                  Imported
                </b-button>
                <b-button
                  class="footy-button"
                  @click="
                    strategyMode == 'preset-alerts'
                      ? promptImport(item.id)
                      : importStrategy(item.id)
                  "
                  v-else
                >
                  Import Strategy
                </b-button>
              </b-overlay>
            </div>
          </div>
        </div>
      </div>
    </template>
    <PromptModal
      v-model="showImportPrompt"
      title="Import Strategy"
      message="As with all football tips and betting strategies, Footy Amigo cannot guarantee results. These strategies are created and used by our team before we publish them and we're very confident in their ability to be profitable over the long-run. Always gamble responsibly."
      @accepted="importStrategy"
      :hideCancel="true"
      acceptText="I Understand"
      buttonGroupClass="centered"
    >
    </PromptModal>
  </div>
</template>

<script>
export default {
  props: {
    strategies: Array,
    strategyType: String,
    strategyMode: String,
  },

  data() {
    return {
      imported: {},
      loading: {},
      showImportPrompt: false,
      importId: null,
    };
  },
  methods: {
    async importStrategy(id) {
      id = id || this.importId;
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
    async promptImport(id) {
      this.showImportPrompt = true;
      this.importId = id;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";
.explore-alerts-table {
  display: grid;
  gap: 0px;
  min-height: 300px;
  align-content: flex-start;
  .explore-alerts-table-row {
    .explore-alerts-table-label {
      color: $grey;
    }
    display: grid;
    grid-template-columns:
      minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)
      minmax(0, 1.4fr);
    gap: 12px;
    border: 1px solid #f0f1f0;
    border-top: none;
    padding: 16px;
    .explore-alerts-table-label {
      display: none;
    }
  }
  .explore-alerts-table-head {
    border: none;
    // padding: 4px 16px;
    border-top: 1px solid #f0f1f0;
    border-bottom: 1px solid #f0f1f0;
  }
}
@media screen and (min-width: $lg) {
  .explore-alerts-table {
    .explore-alerts-table-row {
      .explore-alerts-table-item {
        align-items: center;

        display: grid;
      }
      .explore-alerts-table-label {
        display: none;
      }
    }
  }
}

@media screen and (max-width: $lg) {
  .explore-alerts-table {
    gap: 12px;
    .explore-alerts-table-row {
      .explore-alerts-table-label {
        display: block;
        margin-bottom: 8px;
      }
      .actions-item {
        grid-column: span 2;
        .btn {
          width: 100%;
        }
      }
      border-top: 1px solid #f0f1f0;

      border-radius: 4px;
      grid-template-columns: 1fr 1fr;

      .hide-on-mobile {
        display: none;
      }
    }
    .explore-alerts-table-head {
      display: none;
    }
  }
}
</style>
