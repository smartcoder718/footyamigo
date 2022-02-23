<template>
  <div class="arrow-button w-100">
    <label
      :class="[reversed ? 'rotate-180' : '', 'desktop-version']"
      class="d-none d-lg-flex"
    >
      <input
        type="checkbox"
        :value="checkbox_value"
        v-model="selected"
        @click="$emit('click')"
        hidden
      />
      <RightIcon />
    </label>

    <label class="d-lg-none bg-secondary w-100">
      <input
        type="checkbox"
        :value="checkbox_value"
        v-model="selected"
        hidden
        @click="$emit('click')"
      />
      {{ !reversed ? "Exclude" : "Include" }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    checkbox_value: null,
    value: null,
    reversed: Boolean
  },
  data() {
    return {
      id: this.$uuid.v4()
    };
  },
  methods: {
    uncheckOther() {
      console.log(this.value);
    }
  },
  computed: {
    selected: {
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
.arrow-button {
  display: inline-flex;
}

.arrow-button:hover {
  /* filter: blur(10px); */
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.arrow-button label.d-lg-flex {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  &.rotate-180 {
    transform: rotate(180deg);
  }
  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05));
  }
  &:active {
    animation: blinker 1s linear infinite;
    // background-image: linear-gradient(rgba(0, 0, 0, 0.4));
  }
}
.arrow-button label.d-lg-none {
  width: 100%;
  padding: 18px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.9;
  }
}
</style>
