<template>
  <div>
    <MomentumChart class="momentum" :fixture="fixture">
      <div
        v-for="(event, index) in events"
        :key="index"
        :class="
          event.team_id == fixture.home_id
            ? 'playground-event-home'
            : 'playground-event-away'
        "
        :style="{ left: getPosition(event.minute) }"
      >
        <component
          :is="getIcon(event.type)"
          v-b-tooltip.hover.bottom
          :title="selectEvent(event)"
          class="event-playgroun-icon"
          v-if="getIcon(event.type)"
        ></component>
        <!-- @click="selectEvent(event)" -->
        <!-- :class="selectedId == event.id ? 'selected-event' : ''" -->
      </div>
    </MomentumChart>
    <!-- <h6 class="centered text-primary">{{ selectedEvent }}</h6> -->
  </div>

  <!-- <div class="playground" :style="progressStyle" v-if="events">
    <DividerIcon class="playground-divider" />
    <div
      v-for="(event, index) in events"
      :key="index"
      :class="
        event.team_id == fixture.home_id
          ? 'playground-event-home'
          : 'playground-event-away'
      "
      :style="{ left: getPosition(event.minute) }"
    >
      <component
        :is="getIcon(event.type)"
        v-if="getIcon(event.type)"
      ></component>
    </div>
  </div> -->
</template>

<script>
import CornerIcon from "@/static/icons/playground-corner.svg";
import GoalIcon from "@/static/icons/goal.svg";
import DividerIcon from "@/static/icons/playground-divider.svg";
import RedcardIcon from "@/static/icons/red.svg";
import YellowcardIcon from "@/static/icons/yellow.svg";
import MomentumChart from "~/components/common/MomentumChart";
export default {
  props: {
    fixture: Object,
    events: Array,
  },
  data() {
    return {
      selectedEvent: "",
      selectedId: null,
    };
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
  },
  components: {
    DividerIcon,
    MomentumChart,
  },
  methods: {
    selectEvent(event) {
      var event_label = "";
      var team_label = "Away";
      switch (event.type) {
        case "goal":
        case "penalty":
          event_label = "Goal";
          break;
        case "yellowcard":
        case "yellowredcard":
          event_label = "Yellow Card";
          break;
        case "redcard":
          event_label = "Red Card";
          break;
        case "corner":
          event_label = "Corner";
          break;
        default:
          event_label = "";
      }

      if (event.team_id == this.fixture.home_id) {
        team_label = "Home";
      }
      this.selectedId = event.id;
      return (this.selectedEvent = `${event.minute}' ${team_label} ${event_label}`);
    },
    getIcon(type) {
      switch (type) {
        case "goal":
        case "penalty":
          return GoalIcon;
        case "yellowcard":
        case "yellowredcard":
          return YellowcardIcon;
        case "redcard":
          return RedcardIcon;
        case "corner":
          return CornerIcon;
        default:
          return null;
      }
    },
    getPosition(minute) {
      return ((minute - 1) / 90) * 100 + "%";
    },
  },
};
</script>

<style lang="scss">
.playground {
  height: 40px;
  // max-width: 515px;
  width: 100%;

  border: 8px solid #60685f;
  border-radius: 4px;
}

.momentum {
  position: relative;
}
.playground-divider {
  position: absolute;
  left: 50%;
}
.playground-event-home {
  position: absolute;
  top: 15px;
  cursor: pointer;
  svg path {
    fill: rgb(33, 150, 243);
  }
}

.selected-event {
}
.event-playgroun-icon:hover, .event-playgroun-icon:active, .event-playgroun-icon:focus {
  transform: scale(1.4)
}
.playground-event-away {
  position: absolute;
  bottom: 40px;
  cursor: pointer;
  svg path {
    fill: rgb(255, 186, 90);
  }
}
</style>
