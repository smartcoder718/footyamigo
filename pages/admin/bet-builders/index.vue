<template>
  <div>
    <b-row>
      <b-col cols="12">
        <h3>Bet Builders</h3>
        <div>
          <b-button
            class="footy-button"
            :to="{ name: 'admin-bet-builders-create' }"
          >
            Create
          </b-button>
        </div>

        <b-table :items="bet_builders" :fields="fields" class="my-4" borderless>
          <template #cell(active)="data">
            <footy-switch
              v-model="data.value"
              @click.native.prevent="toggleBetBuilder(data.item.id)"
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
                  name: 'admin-bet-builders-edit-id',
                  params: { id: data.item.id }
                }"
                >Edit</b-dropdown-item
              >
              <b-dropdown-item @click="deleteBetBuilder(data.item.id)">
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
export default {
  layout: "admin",
  data() {
    return {
      bet_builders: [],
      fields: ["title", "active", "updated_at", "actions"]
    };
  },
  methods: {
    async fetchBetBuilders() {
      const bet_builders = await this.$axios.$get("/admin/bet-builders");
      this.bet_builders = bet_builders;
    },
    async toggleBetBuilder(id) {
      const params = { id };
      const bet_builder = await this.$axios.$get(
        "/admin/bet-builders/toggle-active",
        {
          params
        }
      );
      this.fetchBetBuilders();
    },
    async deleteBetBuilder(id) {
      const params = { id };
      const bet_builder = await this.$axios.$get("/admin/bet-builders/delete", {
        params
      });
      this.fetchBetBuilders();
    }
  },
  mounted() {
    this.fetchBetBuilders();
  }
};
</script>

<style></style>
