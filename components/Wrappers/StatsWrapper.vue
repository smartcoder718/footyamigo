<template>
  <div class="wrapper stats-wrapper">
    <div class="title">{{ item.title }}</div>
    <div class="stats">
      <div class="stat" :class="home_stat > away_stat ? 'active' : ''">
        {{ formatVal(home_stat) }}
      </div>
      <div class="stat mx-1">-</div>
      <div class="stat" :class="away_stat > home_stat ? 'active' : ''">
        {{ formatVal(away_stat) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    fixture: Object,
  },
  data() {
    return {};
  },
  methods: {
    formatVal(value) {
      var symbol = this.item.type == "per" ? "%" : "";
      if (value == 0) {
        return 0 + symbol;
      } else if (value) {
        return value + symbol;
      } else {
        return "NA";
      }
    },
  },
  computed: {
    home_stat() {
      return this.fixture.home[this.item.home];
    },
    away_stat() {
      return this.fixture.away[this.item.away];
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.stats-wrapper {
  padding:14px !important;
  .title {
    font-weight: bold !important; //COLFAX
    font-size: 10px;
    line-height: 15px;

    display: flex;
    align-items: center;

    color: $dark-1;
  }
  .stats {
    display: flex;
    
    align-items: center;
    width: 80px;
    justify-content: center;
    .stat {
      
      align-items: center;
      //z-index: 10;
      height: 100%;
      //padding: 2px 5px;
      background: #ffffff0d;
      font-weight: bold !important; //COLFAX
      font-size: 14px;
      line-height: 21px;
      color: #60685f;
      &.active {
        color: #60b15a;
        // z-index: 20;
      }
      &:first-child {
        margin-right: 2px;
      }

      &:first-child {
        text-align: right;
      }
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: left;
      }
    }
  }
}
</style>