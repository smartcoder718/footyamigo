<template>
  <b-modal
    hide-footer
    v-model="showPrompt"
    hide-header
    modal-class="promp-modal border-0"
    body-class="border-0 rounded-20 prompt-modal-body"
    content-class="border-0 rounded-20"
    body-bg-variant="light"
  >
    <h3 class="rules-preview-title">
      {{ title }}

      <b-button
        variant="white"
        class="float-right rounded"
        @click="cancelAction"
      >
        <span class="material-icons"> close </span>
      </b-button>
    </h3>
    <h4 class="fw-normal" v-html="message"></h4>

    <div
      class="footy-button-group prompt-button-group"
      :class="[buttonGroupClass]"
    >
      <b-button
        variant="white"
        class="footy-button"
        @click="cancelAction"
     
        v-if="!hideCancel"
      >
        Cancel
      </b-button>
      <b-button
        variant="primary"
        class="footy-button"
        @click="confirmAction"
        v-if="!negative"
      >
        {{ acceptText }}
      </b-button>
      <b-button
        variant="dangerous"
        class="footy-button"
        @click="confirmAction"
        v-else
      >
        Continue
      </b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    value: Boolean,
    negative: Boolean,
    title: { type: String, default: "Leagues Exclusion" },
    hideCancel: { type: Boolean, default: false },
    buttonGroupClass: String,
    acceptText: { type: String, default: "Confirm" },
    message: {
      type: String,
      default:
        "Do You want to Exclude this league from your strategy? Once excluded you won't receive alerts from this league."
    }
  },
  computed: {
    showPrompt: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    cancelAction() {
      this.showPrompt = false;
      this.$emit("rejected");
    },
    confirmAction() {
      this.$emit("accepted");
      this.showPrompt = false;
    }
  }
};
</script>

<style lang="scss">
.prompt-modal-body {
  padding: 28px 16px;
  display: grid;
  gap: 20px;
}
.prompt-button-group {
  justify-content: flex-end;
  &.centered {
    justify-content: center;
  }
}
</style>
