<template>
  <div class="times">
    <b-row no-gutters>
      <!-- <b-col :md="['disabled', 'disabled'].includes(timer.time) ? '12' : '8'"> -->
      <b-col md="8">
        <footy-dropdown-select
          v-model="timer.time"
          label="Time"
          :options="Object.values(in_play_time)"
          id="time"
          info="At what time in the live match should the condition be met? E.g At Minute 25"
        ></footy-dropdown-select>
        <!-- info="At what time in the live match do you want to be alerted? E.g At Minute 25" -->
      </b-col>
      <b-col md="4" class="pl-md-3 pl-0">
        <template>
          <template v-if="in_play_time[timer.time].type == 'multiple'">
            <b-row no-gutters>
              <b-col>
                <footy-input
                  v-model="timer.from"
                  label="From"
                  id="from"
                  :min="0"
                  :max="90"
                  type="number"
                  class="mr-2"
                ></footy-input>
              </b-col>
              <b-col>
                <footy-input
                  v-model="timer.to"
                  label="To"
                  id="to"
                  :min="0"
                  :max="90"
                  type="number"
                  lass="ml-2"
                ></footy-input>
              </b-col>
            </b-row>
          </template>
          <template v-else-if="in_play_time[timer.time].type == 'fixed'">
            <footy-input
              :min="0"
              :max="90"
              v-model="timer.minute"
              type="number"
              label="Minute"
              id="minute"
            ></footy-input>
          </template>
        </template>
      </b-col>
    </b-row>
    <div class="text-grey p-2">
      <small v-if="in_play_time[timer.time].type == 'multiple'">
        {{
          in_play_time[timer.time].label
            .replace("?", activeRule)
            .replace("X", timer.from)
            .replace("Y", timer.to)
        }}
      </small>
      <small v-else>
        {{
          in_play_time[timer.time].label
            .replace("?", activeRule)
            .replace("X", timer.minute)
    
        }}
      </small>
    </div>
  </div>
</template>

<script>
import in_play_time from "~/components/json/in-play-time.json";

export default {
  data() {
    return {
      in_play_time
    };
  },
  props: {
    value: Object,
    activeRule: String
  },
  computed: {
    timer: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    "timer.minute": function(newVal) {
      if (parseInt(newVal) > 90) {
        this.timer.minute = parseInt(90);
      } else {
        this.timer.minute = parseInt(newVal || 0);
      }
    }
    // timer: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     this.$store.commit("setinPlayTimer", val);
    //   }
    // }
  }
};
</script>

<style></style>
