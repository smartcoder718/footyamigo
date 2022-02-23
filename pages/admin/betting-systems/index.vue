<template>
  <div>
    <b-row>
      <b-col cols="12">
        <h3>Betting Systems</h3>
        <div>
          <b-button class="footy-button" @click="toggleShowCreate">
            Create
          </b-button>
        </div>

        <b-modal
          v-model="showCreate"
          size="xl"
          :title="`${editMode ? 'Edit' : 'Create'} Betting System`"
          hide-footer
          content-class="border-0"
        >
          <CreateBettingSystem v-model="edit" v-if="editMode" />
          <CreateBettingSystem v-model="create" v-else />
          <b-row>
            <b-col>
              <b-button
                class="mt-3 footy-button"
                variant="secondary"
                block
                @click="showCreate = false"
                >Cancel</b-button
              >
            </b-col>
            <b-col>
              <b-button
                class="mt-3 footy-button"
                variant="success"
                block
                @click="createBettingSystem"
                >Done</b-button
              >
            </b-col>
          </b-row>
        </b-modal>

        <b-table
          :items="betting_systems"
          :fields="fields"
          class="my-4"
          borderless
        >
          <template #cell(active)="data">
            <footy-switch
              v-model="data.value"
              @click.native.prevent="toggleBettingSystem(data.item.id)"
            >
            </footy-switch>
          </template>

          <template #cell(updated_at)="data">
            {{ $moment(data.value).fromNow() }}
          </template>
          <template #cell(actions)="data">
            <b-dropdown split size="sm" text="View" class="actions-dropdown">
              <b-dropdown-item @click="toggleShowEdit(data.index)"
                >Edit</b-dropdown-item
              >
              <b-dropdown-item @click="deleteBettingSystem(data.item.id)">
                <span class="text-danger">Delete </span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CreateBettingSystem from "~/components/betting-systems/CreateBettingSystem.vue";
export default {
  layout: "admin",
  data() {
    return {
      betting_systems: [],
      fields: ["title", "active", "updated_at", "actions"],
      editMode: false,
      showCreate: false,
      create: {
        title: null,
        description: null,
        roi: null,
        video_url: null,
        video_description: null,
        learn: null,
        presets: []
      },
      edit: {
        id: null,
        title: null,
        description: null,
        roi: null,
        video_url: null,
        video_description: null,
        learn: null,
        presets: []
      }
    };
  },
  components: {
    CreateBettingSystem
  },
  methods: {
    async fetchBetingSystems() {
      const betting_systems = await this.$axios.$get("/admin/betting-systems");
      this.betting_systems = betting_systems;
    },
    async toggleBettingSystem(id) {
      const params = { id };
      const betting_system = await this.$axios.$get(
        "/admin/betting-systems/toggle-active",
        {
          params
        }
      );
      this.fetchBetingSystems();
    },
    async createBettingSystem() {
      try {
        const betting_system = await this.$axios.$post(
          "/admin/betting-systems/" + (this.editMode ? "update" : "create"),
          this.editMode ? this.edit : this.create
        );
        console.log(betting_system);
        this.fetchBetingSystems();
      } catch (error) {
        console.error(error);
      } finally {
        this.showCreate = false;
      }
    },
    toggleShowCreate() {
      this.editMode = false;
      this.showCreate = !this.showCreate;
    },
    toggleShowEdit(index) {
      this.editMode = true;
      Object.assign(this.edit, this.betting_systems[index]);
      this.showCreate = !this.showCreate;
    },
    async deleteBettingSystem(id) {
      const params = { id };
      const betting_system = await this.$axios.$get(
        "/admin/betting-systems/delete",
        {
          params
        }
      );
      this.fetchBetingSystems();
    }
  },
  mounted() {
    this.fetchBetingSystems();
  }
};
</script>

<style></style>
