<template>
  <div>
    <div class="white-box mb-4">
      <div class="d-flex justify-content-between">
        <div class="content">
          <h4>Make Public</h4>
          <h6 class="description-text">
            Making your strategy public will allow it to be found by other Footy
            Amigo Pro users and also allows you to be able to see profitable
            strategies from other users.
          </h6>
        </div>
        <div class="btn">
          <footy-switch v-model="form.is_public" name="make-public">
          </footy-switch>
        </div>
      </div>
    </div>

    <footy-vertical-checkbox
      v-model="form.leagues"
      :options="$store.state.leagues"
      name="leagues"
      id="leagues"
      class="mb-4"
      label="Select Leagues"
      filtered
      outcomes
    ></footy-vertical-checkbox>

    <div class="d-flex my-3">
      <h4 class="mr-2">Add Note</h4>
      <footy-switch v-model="form.has_note" name="add-note"> </footy-switch>
    </div>
    <b-textarea
      v-show="form.has_note"
      v-model="form.note"
      style="border-radius: 8px; transition: visibility 0s, opacity 0.5s linear"
    >
    </b-textarea>

    <div class="step-button-group mt-5">
      <b-button
        class="footy-button"
        @click="$emit('prevstep')"
        href="#create-strategy"
      >
        <PrevIcon class="icon-left" />
        Previous Step
      </b-button>

      <b-button
        class="footy-button"
        variant="primary"
        :disabled="form.leagues.length == 0"
        @click="$emit('save')"
        href="#create-strategy"
      >
        Finish & Save
        <NextIcon class="icon-right" />
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
  // scrollToTop: true,

  computed: {
    form: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/colors";
.white-box {
  background: #ffffff;
  border: 1px solid #d5ded5;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px;
}

.flex-justify-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.center {
  display: flex;
  align-items: center;
  vertical-align: middle;
}

.flex-1 {
  flex: 1;
}
</style>
