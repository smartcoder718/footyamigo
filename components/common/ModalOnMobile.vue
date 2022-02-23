<template>
  <div>
    <div class="d-none d-lg-block">
      <slot> </slot>
    </div>

    <b-sidebar
      id="sidebar-backdrop"
      backdrop-variant="dark"
      backdrop
      shadow
      no-header
      no-slide
      class="footy-mobile-modal d-lg-none"
      width="100%"
      height="80%"
      right
      v-model="showModal"
    >
      <slot> </slot>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean
  },
  computed: {
    showModal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style lang="scss">
.rules-preview-container {
  overflow-y: scroll;
}

.footy-mobile-modal {
  .b-sidebar {
    top: auto;
    bottom: 0;
    border-radius: 20px 20px 0px 0px;
    height: 90%;
    .b-sidebar-body {
      overflow-y: hidden;
    }
  }
}
</style>
