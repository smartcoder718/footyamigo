<template>
  <b-row>
    <b-col>
      <div class="p-lg-15">
        <section class="footy-page-header">
          <div class="fixture-page-title-and-switch">
            <h1 class="fixture-page-title">{{ pageTitle }}</h1>
            <b-badge class="footy-button live-button" variant="white">
              <div class="mr-3">Live</div>
              <footy-switch v-model="liveMode"> </footy-switch>
            </b-badge>
          </div>
          <div class="fixture-page-search-box">
            <form class="position-relative search-box">
              <button class="position-absolute" type="submit">
                <span style="margin-bottom: 2px">
                  <img :src="`/icons/search.svg?inline`" alt="" />
                </span>
              </button>
              <input placeholder="Search" />
            </form>
          </div>
        </section>

        <slot> </slot>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import PlayIcon from "~/static/icons/play.svg";

export default {
  props: {
    pageTitle: String,
    pageDescription: String
  },
  data() {
    return {};
  },

  components: {
    PlayIcon
  }
};
</script>
<style lang="scss">
.fixture-page-title-and-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex:1;
  .page-title {
    flex: 1;
  }
}
.live-button {
  border: 1px solid #e3e3e3;
  padding: 16px;
}
.fixture-page-search-box {
  flex:1;
  display: flex;
  
  align-items: center;
}
.search-box {
  max-width: 100%;
  height: 54px;
  width: 100%;
  button {
    background: transparent;
    left: 0px;
    border: none;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    width: 50px;
    height: 54px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input {
    border: none;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    height: 54px;
    background: rgba(240, 242, 239, 0.5);
    width: 100%;
    padding-left: 52px;
    border-radius: 12px;

    font-weight: 500;
    font-size: 18px;
    line-height: 30px;
    color: #60685f;

    &:focus {
      box-shadow: none;
      border: none;
      outline: none;
    }
    &::placeholder {
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
      color: #60685f;
      transform: translateY(2px);
    }
  }
}
</style>
