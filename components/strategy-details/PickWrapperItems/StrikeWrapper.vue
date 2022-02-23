<template>
  <div class="strike-wrapper">
    <button class="strike-button hit" @click="updateStrike('hit')">
      <span class="material-icons"> done </span>Hit
    </button>
    <button class="strike-button miss" @click="updateStrike('miss')">
      <span class="material-icons"> close </span>Miss
    </button>
    <button class="strike-button remove" @click="$emit('deletepick', pick._id)">
      Remove
    </button>
  </div>
</template>

<script>
export default {
  props: {
    pick: Object
  },
  methods: {
    async updateStrike(type) {
      const pick_id = this.pick._id;
      var strike;
      console.log(type, this.pick.strike);
      if (type == "hit") {
        if (this.pick.strike == true) {
          strike = null;
        } else {
          strike = true;
        }
      } else {
        if (this.pick.strike == false) {
          strike = null;
        } else {
          strike = false;
        }
      }

      await this.$axios.post("/user/strategies/picks/strike", {
        pick_id,
        strike
      });
      this.$set(this.pick, "strike", strike);
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
@import "~/assets/scss/breakpoints";
.strike-wrapper {
  display: flex;
  flex-direction: column;
  column-gap: 12px;
  row-gap: 2px;

  // margin-right: 70px;
  button.strike-button {
    flex: 1;
    filter: brightness(100%);
    .material-icons {
      font-size: 14px;
      margin-right: 5px;
    }
    &:hover {
      filter: brightness(95%);
    }
    &.hit {
      background: #60b15a;
      color: white;
    }
    &.miss {
      background: #60685f;
      color: white;
    }
    font-weight: bold !important; //COLFAX
    font-size: 12px;
    text-align: left;
    line-height: 18px;
    padding: 6px;
    border-radius: 2px;
    border: none;
    color: $dark-1;
    background: #eef5ed;
    // margin: 1px;
  }
}
@media screen and (max-width: $lg) {
  .strike-wrapper {
    flex-direction: row;
    margin-top: 16px;
    button.strike-button {
      text-align: center;
    }
  }
}
</style>
