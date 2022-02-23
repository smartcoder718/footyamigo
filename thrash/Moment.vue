<template>
  <div>
    <div class="bg-white momentum-chart-container">
      <canvas :id="'momentum-chart-' + id"></canvas>
    </div>
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
import { Utils } from "chart.js/auto";

Chart.defaults.font.size = 12;
Chart.defaults.font.weight = 600;
Chart.defaults.font.family = "Poppins";

export default {
  props: {
    format: String,
    type: String,
    half: String,
    fixture: Object,
    homeData: Object,
    awayData: Object,
    momentum: Object
  },
  data() {
    return {
      chart: null,

      id: this.$uuid.v4(),
      series: [
        {
          name: "Cash Flow",
          data: [
            1.45,
            5.42,
            5.9,
            -0.42,
            -12.6,
            -18.1,
            -18.2,
            -14.16,
            -11.1,
            -6.09,
            0.34,
            3.88,
            13.07,
            5.8,
            2,
            7.37,
            8.1,
            13.57,
            15.75,
            17.1,
            19.8,
            -27.03,
            -54.4,
            -47.2,
            -43.3,
            -18.6,
            -48.6,
            -41.1,
            -39.6,
            -37.6,
            -29.4,
            -21.4,
            -2.4
          ]
        }
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: -100,
                  to: 0,
                  color: "#60b15a"
                },
      
              ]
            },
            columnWidth: "80%"
          }
        },
        dataLabels: {
          enabled: false
        },
        yaxis: {
          title: {
            text: "Growth"
          },
          labels: {
            formatter: function(y) {
              return y.toFixed(0) + "%";
            }
          }
        },
        xaxis: {
          type: "datetime",
          categories: [
            "2011-01-01",
            "2011-02-01",
            "2011-03-01",
            "2011-04-01",
            "2011-05-01",
            "2011-06-01",
            "2011-07-01",
            "2011-08-01",
            "2011-09-01",
            "2011-10-01",
            "2011-11-01",
            "2011-12-01",
            "2012-01-01",
            "2012-02-01",
            "2012-03-01",
            "2012-04-01",
            "2012-05-01",
            "2012-06-01",
            "2012-07-01",
            "2012-08-01",
            "2012-09-01",
            "2012-10-01",
            "2012-11-01",
            "2012-12-01",
            "2013-01-01",
            "2013-02-01",
            "2013-03-01",
            "2013-04-01",
            "2013-05-01",
            "2013-06-01",
            "2013-07-01",
            "2013-08-01",
            "2013-09-01"
          ],
          labels: {
            rotate: -90
          }
        }
      }
    };
  },
  watch: {},
  computed: {
    data() {
      const labels = [...Array(95).keys()];
      const home_momentum = [];
      const away_momentum = [];
      var max_momentum = 0;
      for (var i = 0; i < 95; i++) {
        const home_val = this.fixture.momentum.home[i] || 0;
        const away_val = this.fixture.momentum.away[i] || 0;
        const diff = home_val - away_val;
        if (home_val == away_val) {
          home_momentum.push(0);
          away_momentum.push(0);
        } else if (home_val > away_val) {
          home_momentum.push(diff);
          away_momentum.push(0);
        } else {
          away_momentum.push(diff);
          home_momentum.push(0);
        }
        max_momentum = Math.max(max_momentum, Math.abs(diff));
      }

      const data = {
        labels: labels,
        datasets: [
          {
            label: this.fixture.home_name,
            data: home_momentum.map(x => (x / max_momentum) * 90),
            backgroundColor: "#60b15a"
          },
          {
            label: this.fixture.away_name,
            data: away_momentum.map(x => (x / max_momentum) * 90),
            backgroundColor: "#0659A4"
          }
        ]
      };
      return data;
    }
  },
  watch: {
    data: {
      handler() {
        this.chart.data = this.data;
        this.chart.update();
      },
      deep: true
    }
  },
  mounted() {
    const config = {
      type: "bar",
      data: this.data,
      options: {
        plugins: {
          title: {
            display: false
            // text: "Laora v Lesson"
          },
          legend: {
            display: false,
            position: "left"
          }
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false
            }
          },
          y: {
            stacked: true,
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false
            },

            min: -100,
            max: 100
          }
        }
      }
    };
    this.chart = new Chart(
      document.getElementById("momentum-chart-" + this.id),
      config
    );
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~assets/scss/colors";
.momentum-chart-container {
  border: 2px solid $light;
  //padding: 16px 16px 16px 0px;
}
@media (min-width: $lg) {
  .momentum-chart-container {
    //height: 319px;
    //padding: 16px 16px 16px 0px;
  }
}
@media (max-width: $lg) {
  .momentum-chart-container {
    height: 300px;
    width: 100%;
    left: -36px;
    position: relative;
    //padding: 16px 0px 16px 0px;
  }
}
@media (max-width: $sm) {
  .momentum-chart-container {
    height: 300px;
    width: 100%;
    position: unset;
    //padding: 16px 4px 16px 4px;
  }
}
</style>
