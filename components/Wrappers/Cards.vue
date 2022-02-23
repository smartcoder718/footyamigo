<template>
  <div class="yellow-red">
    <div
      class="soccer-card yellow-card d-flex align-items-center"
      :class="yellowTotal > 0 ? '' : 'blind'"
    >
      <span>
        {{ yellowTotal }}
      </span>
    </div>
    <div class="soccer-card red-card" :class="redTotal > 0 ? '' : 'blind'">
      <span>
        {{ redTotal }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixture: Object
  },
  computed: {
    redTotal() {
      if (this.fixture.stats) {
        return (
          this.fixture.stats.home.redcards + this.fixture.stats.away.redcards
        );
      }
    },
    yellowTotal() {
      if (this.fixture.stats) {
        return (
          this.fixture.stats.home.yellowcards +
          this.fixture.stats.away.yellowcards
        );
      }
    }
  }
};
</script>

<style></style>
