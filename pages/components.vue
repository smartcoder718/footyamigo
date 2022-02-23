<template>
  <div>
    <b-row align-h="center">
      <b-col md="7">
        <b-form-group label="Radios using options" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            id="radio-group-1"
            v-model="selected"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
        <component :is="selected" :fixture="fixture"></component>
      </b-col>
    </b-row>
    
  </div>
</template>

<script>
import Download from "../components/CreatePreMatchAlert/Download.vue";
export default {
  data() {
    return {
      options: [ "download"],
      selected: "download",
      fixture: {}
    };
  },
  components: {
    Download,
  },
  methods : {
    async getFixtureById(id) {
      try {
        var fixture = await this.$axios.getFixtureById(id)
        this.fixture = fixture
      } catch (error) {
        console.error(error)
      }
    }
  },
  mounted() {
    this.getFixtureById("60b565d22cfaa714c491449b")
  }
  
};
</script>

<style>
</style>