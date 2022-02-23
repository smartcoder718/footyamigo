<template>
  <div class="result">
    <div>
      <div class="h-4 " v-if="teamName">
        {{ teamName}}
      </div>
      <div class="h-4" :class="teamWon" v-else>
        <span>{{result.home_name}}</span>
        v
        <span>{{result.away_name}}</span>
      </div>
      <div class="h-6 text-grey">{{ location }} • {{ result.date }}</div>
    </div>
    <div>
      <div class="score" :class="winlose">
        <div class="h-4">{{ result.home_goals }}:{{ result.away_goals }}</div>
        <div class="small opacity-7">HT {{result.ht_score||'0-0'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    result: Object,
    teamName: String,
    location: String,
    date: String,
    winlose: String,
  },
  computed: {
    teamWon() {
      if(this.result.home_goals == this.result.away_goals) {
        return ""
      } else if(this.result.home_goals > this.result.away_goals) {
        return "homewin"
      } else {
        return "awaywin"
      }
    }
  }
};
</script>

<style lang="scss">
.result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .homewin {
    span:first-child() {
      color:#60b15a;
    }
  }
  .awaywin {
    span:last-child() {
      color:#60b15a;
    }
  }
}
.score {
  text-align: center;
  background: #60685F;
  border-radius: 4px;
  color: white;
  padding: 5px 12px;
  width: 70px;
  &.win {
    background: #60b15a;
  }
  &.lose {
    background: #dc6060;
  }
  &.draw {
    background: #e4af5e;
  }
}
</style>