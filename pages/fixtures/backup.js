

class Moza {
 
  async getCountryFixtures(country_id) {
    try {
      if (this.all_fixture[country_id].fixtures.length) {
        return (this.all_fixture[country_id].hidden = !this.all_fixture[
          country_id
        ].hidden);
      }
      let ids = this.all_fixture[country_id].fixture_ids;
      var fixtures = await this.$axios.$get("/user/fixtures/ids", {
        params: { ids }
      });
      this.all_fixture[country_id]["fixtures"] = fixtures;
      this.all_fixture[country_id].hidden = false;
    } catch (error) {
      console.error(error);
    }
  }
  
  async getCountries() {
    try {
      let fixtures;
      this.loading = true;
      if (this.liveMode) {
        fixtures = await this.$axios.$get("/user/fixtures/live");
        this.fixture_live = fixtures;
        // this.liveFixturesInterval = setInterval(async () => {
        //   if (this.fixture_live) {
        //     fixtures = await this.$axios.$get("/user/fixtures/live");
        //     this.fixture_live = fixtures;
        //   }
        // }, 20000);
      } else {
        fixtures = await this.$axios.$get("/user/fixtures", {
          params: { date: this.$moment.utc(this.date).format("YYYY-MM-DD") }
        });
        this.all_fixture = fixtures;
      }
      this.loading = false;
      let allFixtures = new Set();
      Object.values(fixtures).forEach(fixture => {
        fixture.fixtures.forEach(fix => allFixtures.add(fix));
        this.tempData = [...allFixtures];
        this.allFixtures = [...allFixtures];
      });
      return fixtures;
    } catch (error) {
      console.error(error);
    }
  }


}
