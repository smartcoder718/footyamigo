<template>
  <div>
    <b-row>
      <b-col cols="12">
        <h3>Updates</h3>
        <div>
          <b-button class="footy-button" :to="{ name: 'admin-updates-create' }">
            Create
          </b-button>
        </div>
        <footy-tab-select v-model="active_tab" :options="tabs" class="my-3">
        </footy-tab-select>

        <b-table :items="updates" :fields="fields" class="my-4" borderless>
          <template #cell(completed)="data">
            <footy-switch
              v-model="data.value"
              @click.native.prevent="toggleUpdate(data.item.id)"
            >
            </footy-switch>
          </template>
          <template #cell(updated_at)="data">
            {{ $moment(data.value).fromNow() }}
          </template>

          <template #cell(actions)="data">
            <b-dropdown split size="sm" text="View" class="actions-dropdown">
              <b-dropdown-item
                :to="{
                  name: 'admin-updates-edit-id',
                  params: { id: data.item.id }
                }"
                >Edit</b-dropdown-item
              >
              <b-dropdown-item @click="deleteUpdate(data.item.id)">
                <span class="text-danger">Delete </span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <MugenScroll
          :handler="fetchUpdates"
          :should-handle="!loading"
          v-if="!loaded"
        >
        </MugenScroll>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      updates: [],
      fields: ["title", "completed", "updated_at", "actions"],
      active_tab: "changelog",
      page: 1,
      loaded: false,
      loading: false,
      tabs: [
        { value: "changelog", text: "ChangeLog" },
        { value: "roadmap", text: "RoadMap" }
      ]
    };
  },
  watch: {
    active_tab() {
      this.page = 1;
      this.updates = [];
      this.loaded = false;
      this.fetchUpdates();
    }
  },
  methods: {
    async fetchUpdates() {
      try {
        this.loading = true;
        const updates = await this.$axios.$get(
          "/admin/updates/" + this.active_tab,
          { params: { page: this.page } }
        );
        this.updates = updates;
        if (updates.length < 50) {
          this.loaded = true;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async toggleUpdate(id) {
      const params = { id };
      const bet_builder = await this.$axios.$get(
        "/admin/updates/toggle-completed",
        {
          params
        }
      );
      // this.fetchUpdates();
    },
    async deleteUpdate(id) {
      const params = { id };
      const bet_builder = await this.$axios.$get("/admin/updates/delete", {
        params
      });
      // this.fetchUpdates();
    }
  },
  mounted() {
    this.fetchUpdates();
  }
};
</script>

<style></style>
