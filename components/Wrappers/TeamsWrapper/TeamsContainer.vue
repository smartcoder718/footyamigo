<template>
  <div class="teams">
    <div class="team-name">
      <b-img :src="home_logo" class="team-logo mr-1 mr-md-2"></b-img>
      <h6 class="name text">
        {{ fixture.home_name | truncate }}
      </h6>
    </div>
    <div class=" d-lg-none px-2">
      v
    </div>
    <div class="team-name">
      <b-img :src="away_logo" class="team-logo mr-2"></b-img>
      <h6 class="name text">
        {{ fixture.away_name | truncate }}
      </h6>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixture: Object
  },
  computed: {
    home_logo() {
      return (
        this.fixture.home_logo ||
        "https://cdn.sportmonks.com/images/soccer/team_placeholder.png"
      );
    },
    away_logo() {
      return (
        this.fixture.away_logo ||
        "https://cdn.sportmonks.com/images/soccer/team_placeholder.png"
      );
    }
  },
  filters: {
    truncate(value) {
      if (!value) {
        return "";
      }
      return value.length > 14 ? value.slice(0, 13) + "…" : value;
    }
  }
};
</script>

<style lang="scss" scoped></style>
