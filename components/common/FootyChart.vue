<template>
  <div class="bg-white chart">
    <canvas id="footyChart"></canvas>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
Chart.defaults.font.size = 12;
Chart.defaults.font.weight = 600;
Chart.defaults.font.family = "Poppins";
var labels = {
  first: [
    "0-5",
    "6-10",
    "11-15",
    "16-20",
    "21-25",
    "26-30",
    "31-35",
    "36-40",
    "41-45"
  ],
  second: [
    "46-50",
    "51-55",
    "56-60",
    "61-65",
    "66-70",
    "71-75",
    "76-80",
    "81-85",
    "86-90"
  ],
  all: [
    "0-5",
    "6-10",
    "11-15",
    "16-20",
    "21-25",
    "26-30",
    "31-35",
    "36-40",
    "41-45",
    "46-50",
    "51-55",
    "56-60",
    "61-65",
    "66-70",
    "71-75",
    "76-80",
    "81-85",
    "86-90"
  ]
};

export default {
  props: {
    format: String,
    type: String,
    half: String,
    fixture: Object,
    homeData: Object,
    awayData: Object
  },
  data() {
    return {
      chart: null,
      tension: 0.4,
      borderColor: 3,
      borderJoinStyle: "round"
    };
  },
  watch: {},
  computed: {
    data() {
      var data = {
        labels: labels[this.half],
        datasets: [
          {
            label: this.fixture.home_name,

            backgroundColor: "#60B15A",
            //cubicInterpolationMode: "monotone",
            borderColor: "#60B15A",
            borderWidth: this.borderWidth,
            tension: this.tension,
            borderJoinStyle: this.borderJoinStyle,

            data: this.homeData[this.type + this.format][this.half]
          },
          {
            label: this.fixture.away_name,
            backgroundColor: "#60685F",
            borderColor: "#60685F",
            borderWidth: this.borderWidth,
            tension: this.tension,
            borderJoinStyle: this.borderJoinStyle,
            //cubicInterpolationMode: "monotone",
            data: this.awayData[this.type + this.format][this.half]
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
      type: "line",
      data: this.data,
      options: {
        layout: {
          padding: 16
        },

        bezierCurve: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            align: "start",
            margin: 8,
            font: {
              size: 16,
              lineHeight: 24,
              weight: 600,
              family: "Poppins",
              color: "#60685F"
            },
        
            labels: {
              font: {
                size: 16,
                lineHeight: 24,
                weight: 600,
                family: "Poppins",
                color: "#60685F"
              },
              usePointStyle: true,
              boxHeight: 8,
              boxWidth: 8,
              lineWidth: 3
            }
          }
        },
        scales: {
          y: {
            grid: {
              drawOnChartArea: false,
              borderWidth: 0,
              lineWidth: 0
            },
            beginAtZero: true,
            ticks: {
              textStrokeWidth: 2,
              size: 20,
              lineHeight: 24,
              weight: 600,
              family: "'Poppins', sans-serif",
              color: "#60685F"
            }
          },
          x: {
            grid: {
              drawOnChartArea: false,
              borderWidth: 0,
              lineWidth: 0
            },

            beginAtZero: true
          }
        },
        pointLabels: {
          fontStyle: "bold"
        }
      }
    };
    this.chart = new Chart(document.getElementById("footyChart"), config);
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.chart {
  height: 319px;
  margin-bottom: 20px;
  //padding: 16px 16px 16px 0px;
}
@media (min-width: $lg) {
  .chart {
    //height: 319px;
    //padding: 16px 16px 16px 0px;
  }
}
@media (max-width: $lg) {
  .chart {
    height: 300px;
    width: 413px;
    left: -36px;
    position: relative;
    //padding: 16px 0px 16px 0px;
  }
}
@media (max-width: $sm) {
  .chart {
    height: 300px;
    width: 100%;
    position: unset;
    //padding: 16px 4px 16px 4px;
  }
}
</style>
