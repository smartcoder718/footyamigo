<template>
  <div>
    <div class="d-lg-none">
      <b-sidebar
        shadow
        v-model="sidebarOpen"
        :backdrop="true"
        width="258px"
        no-header
        z-index="100"
        :class="sidebarOpen ? '' : 'hidden'"
      >
        <SidebarInner> </SidebarInner>
      </b-sidebar>
    </div>
    <div class="sidebar d-none d-lg-block">
      <SidebarInner> </SidebarInner>
    </div>
  </div>
</template>

<script>
import SidebarInner from "./SidebarInner.vue";
export default {
  components: { SidebarInner },
  props: {
    value: Boolean
  },
  computed: {
    sidebarOpen: {
      get() {
        return this.value;
      },
      set(value) {
        // console.log(value);
        this.$emit("input", value);
        // this.$emit("input", +value);
      }
    }
  },
  methods: {
    openSidebar() {
      this.sidebarOpen = true;
    },
    closeSidebar(i) {
      this.sidebarOpen = false;
      this.activeIndex = i;
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/colors";
@import "~assets/scss/breakpoints";
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 256px;
  background: #fff;
  box-shadow: 1px 0 0 rgb(0 0 0 / 10%);
  height: 100%;
}

@media only screen and (max-width: $lg) {
  .sidebar.hidden {
    display: none;
  }
}
</style>
