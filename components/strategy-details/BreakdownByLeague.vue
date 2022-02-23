<template>
  <div class="breakdown-table text-uppercase">
    <div class="breakdown-table" v-if="items.length">
      <div class="breakdown-table-head breakdown-table-row text-grey bg-light">
        <div>
          LEAGUE
        </div>
        <div>
          PICKED MATCHES
        </div>
        <div>
          STRIKE RATE
        </div>
        <div>
          FAIR ODD
        </div>

        <div>
          ACTION
        </div>
      </div>

      <div v-for="(item, i) in items" :key="i" class="breakdown-table-row">
        <!-- <div
          class="breakdown-table-label league-label"
          style="grid-column: span 2;"
        >
          LEAGUE
        </div> -->
        <div class="breakdown-table-label picked-matches-label text-grey">
          PICKED MATCHES
        </div>
        <div class="breakdown-table-label fair-odd-label text-grey">
          FAIR ODD
        </div>
        <div class="breakdown-table-label strike-rate-label text-grey">
          STRIKE RATE
        </div>

        <!-- <div class="breakdown-table-label actions-label text-grey ">
          ACTION
        </div> -->
        <div class="league-value" v-html="item.league"></div>
        <div class="picked-matches-value">
          {{ item.picked_matches }}
        </div>
        <div
          class="hit-rate strike-rate-label"
          :class="$getColor(item.strike_rate, 'text-')"
        >
          {{ item.strike_rate }}%
          <b-progress
            :value="item.strike_rate"
            :max="100"
            style="border-radius: 10px; margin-top: 10px; max-width:118px; height: 12px;"
          ></b-progress>
        </div>
        <div class="fair-odd-label">
          {{ item.fair_odd }}
        </div>

        <div class="actions-value">
          <b-button
            variant="secondary"
            class="footy-button "
            @click="$emit('deleteleague', item.league_id)"
            >Remove</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";

@import "~/assets/scss/breakpoints";
.breakdown-table {
  display: grid;
  font-weight: 500;
  gap: 4px;
  .breakdown-table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 12px;
    border: 1px solid #f0f1f0;
    padding: 16px;
    // > div {
    //   justify-content: center;

    //   display: flex;
    //   flex-direction: column;
    // }

    .breakdown-table-label {
      display: none;
    }
  }
  .breakdown-table-head {
    border: none;
    padding: 4px 16px;
    border-bottom: 1px solid #f0f1f0;
  }
}
@media screen and (min-width: $lg) {
  .breakdown-table {
    .breakdown-table-row {
      .breakdown-table-label {
        display: none;
      }
    }
  }
}

@media screen and (max-width: $lg) {
  .breakdown-table {
    gap: 12px;
    .breakdown-table-row {
      .breakdown-table-label {
        display: block;
        margin-bottom: 8px;
      }
      .league-label {
        display: none;
      }
      .league-value {
        order: 1;
        grid-column: span 2;
      }
      .picked-matches-label {
        order: 2;
      }
      .picked-matches-value {
        order: 4;
      }
      .fair-odd-label {
        order: 3;
      }
      .fair-odd-value {
        order: 5;
      }
      .strike-rate-label {
        order: 6;
        grid-column: span 2;
      }
      .strike-rate-value {
        order: 7;
        grid-column: span 2;
      }

      .actions-label {
        display: none;
      }
      .actions-value {
        order: 8;
        grid-column: span 2;
        .btn {
          width: 100%;
        }
      }

      border-radius: 4px;
      grid-template-columns: 1fr 1fr;

      .hide-on-mobile {
        display: none;
      }
    }
    .breakdown-table-head {
      display: none;
    }
  }
}
</style>
