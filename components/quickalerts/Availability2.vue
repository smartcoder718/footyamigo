<template>
  <div>
    <div class="lists">
      <div class="list" v-for="(item, i) in list" :key="i">
        <h3 class="title">
          {{ titles[i] }}
        </h3>
        <div class="checkboxes">
          <footy-vertical-checkbox
            :id="titles[i]"
            v-model="availabilityList['existing']"
            :options="item"
            @input="getSelected"
          >
          </footy-vertical-checkbox>
        </div>
      </div>
      <b-button
        text="Save Alert"
        variant="primary"
        block="true"
        icon="notifications"
        @click.native="createQuickAlert"
      >
        <span class="d-inline-block" style="transform: translateY(3px)"
          >Save Alert</span
        >
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Availability",
  props: {
    liveMode: Boolean,
  },
  data() {
    return {
      teams: [
        { value: "home", text: "Home Team" },
        { value: "away", text: "Away Team" },
      ],
      settings: {
        teams: ["home"],
      },
      availabilityList: [],
    };
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList() {
      const ax = await this.$axios.create();
      ax.setBaseURL("/");
      this.availabilityList = await ax.$get("json/availability.json");
      this.availabilityList["existing"] = [];
    },
    getSelected(option) {
      console.log(option);
    },
    async createQuickAlert() {
      // const quick_alert = await this.$axios.$post(
      //   "/user/quickalerts/create",
      //   this.form
      // );
      // console.log(quick_alert);
      // alert()
      console.log(this.availabilityList);
      // return quick_alert;
    },
  },
  computed: {
    list() {
      return Object.keys(this.availabilityList)
        .filter((key) => key !== "existing")
        .map((key) =>
          this.availabilityList[key].map((item) => {
            return {
              text: item.name,
              value: item.name,
            };
          })
        );
    },
    titles() {
      return Object.keys(this.availabilityList).filter(
        (key) => key !== "existing"
      );
    },
  },
};
</script>

<style lang="scss">
.lists {
  .list {
    max-width: 564px;
    width: 100%;
    overflow-x: auto;
    .title {
      // font-family: "Poppins"; //REPLACEDTEMPORARILY //REPLACED
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
      
      margin-bottom: 5px;
      text-transform: capitalize;
      position: sticky;
      left: 0;
    }
  }
}
</style>