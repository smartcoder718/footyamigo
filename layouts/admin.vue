<template>
  <div id="nuxt">
    <b-navbar
      toggleable="lg"
      type="light"
      variant="light"
      class="p-0 d-lg-none"
      sticky
    >
      <b-button
        @click="sidebarOpen = !sidebarOpen"
        variant="transparent"
        class="p-2 m-0"
      >
        <span class="material-icons">
          {{ sidebarOpen ? "close" : "menu" }}
        </span>
      </b-button>
      <b-navbar-brand href="#" class="mr-auto">
        <b-img-lazy src="/logo.png" class="footy-mobile-logo"></b-img-lazy
      ></b-navbar-brand>
    </b-navbar>
    <SidebarAdmin v-model="sidebarOpen"> </SidebarAdmin>
    <section class="footy-page-content">
      <Nuxt />
    </section>
  </div>
</template>
<script>
import SidebarAdmin from "~/components/SidebarAdmin";

export default {
  data() {
    return {
      sidebarOpen: false
    };
  },
  components: {
    SidebarAdmin
  },
  middleware: ["auth", "superman"],
  mounted() {},
  methods: {}
};
</script>
