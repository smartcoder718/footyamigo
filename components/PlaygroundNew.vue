<template>
  <div class="playground" :style="progressStyle">
    <DividerIcon class="playground-divider" />

    <template v-for="type in types">
      <template v-for="team in teams">
        <template
          v-if="
            fixture.stats_minute &&
            fixture.stats_minute[team] &&
            fixture.stats_minute[team][type]
          "
        >
          <div
            v-for="(count, minute) in getTimings(team, type)"
            :key="minute + '-' + type + '-' + team"
            :class="'playground-event-' + team"
            :style="{ left: getPosition(minute) }"
          >
            <template v-if="count > 0">
              <template v-for="i in count">
                <component
                  :is="getIcon(type)"
                  v-if="getIcon(type)"
                  :key="i"
                ></component>
              </template>
            </template>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>
Hi, We have a requirement to create a match progress bar looking something like
this. https://imgur.com/a/8lHJJmu We are already using the events goals , cards
include with fixture to show this data. But we have noticed that the said data
is missing for a lot of games. Even though we have the timing for each event in
trends include. As an alternative we have an option to use trends data to create
the progress. But due to trends data missing the information about which half
the stat belongs to. It's not possible to create

<script>
import CornerIcon from "@/static/icons/playground-corner.svg";
import GoalIcon from "@/static/icons/goal.svg";
import DividerIcon from "@/static/icons/playground-divider.svg";
import RedcardIcon from "@/static/icons/red.svg";
import YellowcardIcon from "@/static/icons/yellow.svg";
export default {
  props: {
    fixture: Object,
  },
  computed: {
    elapsed() {
      return Math.round((this.fixture.minute / 90) * 100);
    },
    remaining() {
      return 100 - this.elapsed;
    },
    progressStyle() {
      return `background: linear-gradient(to right, #60b15a ${this.elapsed}%, #eef5ed ${this.elapsed}%, #eef5ed ${this.remaining}%);`;
    },
    timings() {},
  },
  data() {
    return {
      types: ["goals", "yellowcards", "yellowredcards", "redcards", "corners"],
      teams: ["home", "away"],
    };
  },
  components: {
    DividerIcon,
  },
  methods: {
    getTimings(team, type) {
      try {
        const fixture = this.fixture;
        if (
          fixture.stats_minute &&
          fixture.stats_minute[team] &&
          fixture.stats_minute[team][type]
        ) {
          const timings = this.fixture.stats_minute[team][type];
          console.log(timings, "TIMINGS", "GANUD");
          const timings_new = [timings[0]];
          var prev = 0;
          var minute = 0;
          for (var minute = 1; minute < timings.length; minute++) {
            timings_new.push(timings[minute] - timings[minute - 1]);
          }
          console.log(timings_new);
          // for (var timing of timings) {
          //   // if (timing != prev) {
          //   //   timings_new.push(minute);
          //   // }
          //   prev = timing;
          //   minute += 1;
          // }
          return timings_new;
        }
        return [];
      } catch (error) {
        return [];
      }
    },
    getIcon(type) {
      switch (type) {
        case "goals":
        case "penalties":
          return GoalIcon;
        case "yellowcards":
        case "yellowredcards":
          return YellowcardIcon;
        case "redcards":
          return RedcardIcon;
        case "corners":
          return CornerIcon;
        default:
          return null;
      }
    },
    getPosition(minute) {
      return (minute / 90) * 100 + "%";
    },
  },
};
</script>

// <style lang="scss">
// .playground {
//   height: 40px;
//   // max-width: 515px;
//   width: 100%;
//   position: relative;
//   border: 8px solid #60685f;
//   border-radius: 4px;
// }

// .playground-divider {
//   position: absolute;
//   left: 50%;
// }
// .playground-event-home {
//   position: absolute;
//   top: -10px;
// }

// .playground-event-away {
//   position: absolute;
//   bottom: -10px;
// }
// </style>
