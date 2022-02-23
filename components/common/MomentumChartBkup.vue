<template>
  <div class="bg-white pr-2" style="height: 180px">
    <apexchart
      type="bar"
      height="100%"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <slot />
  </div>
</template>
<script>
import ApexCharts from "apexcharts";
export default {
  props: {
    format: String,
    type: String,
    half: String,
    fixture: Object,
    homeData: Object,
    awayData: Object,
    momentum: Object,
  },
  data() {
    return {
      //Chart bar data
      // series: [
      //   {
      //     name: "Cash Flow",
      //     data: [
      //       59, -16, 20, 74, -1, 91, -1, 28, 63, 40, -72, 9, -1, 6, -6, 33, 16,
      //       -66, -12, 45, 47, 73, 17, 33, 44, -16, -41, -45, 70, 11, -82, 62,
      //       -88, -61, -47, 95, 17, -20, 11, 20, -66, 61, 63, 84, 65, 81, 96, 65,
      //       61, -75, 39, -38, 48, -93, 0, -35, 91, -32, 52, -5, 92, -39, 14, 16,
      //       -28, -57, 46, 79, 52, 40, 29, 1, 28, 9, 15, 14, 40, -29, -1, -28,
      //       -9, 15, 14, -15, -14, 40, -29, -1, 28, 9,
      //     ],
      //   },
      // ],

      // Chart Option
      chartOptions: {
        //Chart Type
        chart: {
          id: "chart1",
          type: "bar",
          toolbar: false,
        },

        //Chart grid bar show or hide
        grid: {
          yaxis: {
            lines: {
              show: false,
            },
          },
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          },
        },
        tooltip: {
          enabled: false,
        },

        //Chart Bar Color
        plotOptions: {
          position: "back",
          bar: {
            colors: {
              //Range wise bar color
              ranges: [
                {
                  from: 0,
                  to: 100,
                  color: "rgb(33,150,243)",
                },
                {
                  from: -100,
                  to: -1,
                  color: "rgb(255,186,90)",
                },
              ],
            },
            columnWidth: "80%",
          },
        },
        dataLabels: {
          enabled: false,
        },

        //Y axis labeling
        yaxis: {
          min: -100,
          max: 100,
          title: {
            show: false,
          },
          labels: {
            show: false,
          },
        },

        //X axis labeling
        xaxis: {
          min: 0,
          max: 90,
          type: "category",
          tickAmount: 5,
          categories: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
            53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
            70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
            87, 88, 89, 90,
          ],
          labels: {
            show: true,

            //Label format customizing
            formatter(x) {
              return x.toFixed(0);
            },
          },
        },

        //Background level coloring
        annotations: {
          yaxis: [
            {
              y: 0,
              y2: 50,
              fillColor: "rgb(33,150,243)",
              opacity: 0.3,
            },
            {
              y: 50,
              y2: 100,
              fillColor: "rgb(33,150,243)",
              opacity: 0.1,
            },
            {
              y: -1,
              y2: -50,
              fillColor: "rgb(255,186,90)",
              opacity: 0.3,
            },
            {
              y: -50,
              y2: -100,
              fillColor: "rgb(255,186,90)",
              opacity: 0.1,
            },
          ],

          //X axis bar coloring
          xaxis: [
            {
              x: Number(this.fixture.minute),
              strokeDashArray: 0,
              borderColor: "#e03",
              label: {
                text: this.fixture.minute,
                orientation: "horizontal",
                borderColor: "transparent",
                style: {
                  color: "#e03",
                  background: "transparent",
                  fontSize: "12px",
                  fontWeight: "bold",

                  cssClass: "custom-class",
                },
              },
            },
          ],
        },
      },
    };
  },
  // watch: {
  //   "fixture.minute"(minute) {
  //     console.log(minute, "changed", ApexCharts);
  //     this.chartOptions.annotations.xaxis.splice(0, 1, {
  //       x: Number(this.fixture.minute),
  //       strokeDashArray: 0,
  //       borderColor: "#e03",
  //       label: {
  //         text: this.fixture.minute,
  //         orientation: "horizontal",
  //         borderColor: "transparent",
  //         style: {
  //           color: "#e03",
  //           background: "transparent",
  //           fontSize: "13px",
  //           fontWeight: "bold",
  //           cssClass: "custom-class",
  //         },
  //       },
  //     });
  //     // this.chartOptions.annotations.xaxis = [

  //     // ];
  //   },
  // },
  computed: {
    series() {
      var max_momentum = 0;
      const momentum = [0];
      if (!this.fixture.momentum) {
        return [];
      }
      for (var i = 0; i <= 90; i++) {
        const home_val = this.fixture.momentum.home[i] || 0;
        const away_val = this.fixture.momentum.away[i] || 0;
        const diff = home_val - away_val;
        momentum.push(diff);
        max_momentum = Math.max(max_momentum, Math.abs(diff));
      }
      const series = [
        {
          data: momentum.map((x) => (x / max_momentum) * 90),
        },
      ];
      // if (series[0].data.length < 90) {
      //   series[0].data.push(...new Array(90 - series[0].data.length).fill(0));
      // }

      return series;
    },
  },

  mounted() {},
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~assets/scss/colors";
.custom-class {
  transform: translateY(-16px);
}
</style>
