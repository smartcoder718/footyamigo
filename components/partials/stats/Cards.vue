<template>
  <div>
    <!-- <footy-tab-select
      name="submenu"
      :options="submenuOptions"
      v-model="submenu"
      size="sm"
    >
    </footy-tab-select> -->
    <CardStats :fixture="fixture" :location="location"> </CardStats>
    <!-- <div v-if="submenu == 'Stats'">
      <CardStats :fixture="fixture" :location="location"> </CardStats>
    </div>
    <div v-else>
      <CardsReferee :fixture="fixture"> </CardsReferee>
    </div> -->
  </div>
</template>

<script>
import CardsReferee from "~/components/partials/stats/CardsReferee";
import CardStats from "~/components/partials/stats/CardStats";
export default {
  props: {
    fixture: Object,
    submenu: String,
    location: Object,
  },
  data() {
    return {};
  },
  components: {
    CardsReferee,
    CardStats,
  },
};
</script>

<style></style>
