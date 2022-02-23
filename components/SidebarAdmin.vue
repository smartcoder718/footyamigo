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
        <SidebarInnerAdmin> </SidebarInnerAdmin>
      </b-sidebar>
    </div>
    <div class="sidebar d-none d-lg-block">
      <SidebarInnerAdmin> </SidebarInnerAdmin>
    </div>
  </div>
</template>

<script>
import SidebarInnerAdmin from "./SidebarInnerAdmin.vue";
export default {
  components: { SidebarInnerAdmin },
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
