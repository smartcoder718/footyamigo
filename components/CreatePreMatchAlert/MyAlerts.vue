<template>
  <div>
    <section class="page-strategies">
      <div>{{ strategies.length }} Alerts</div>
    </section>
    <section class="page-content">
      <b-table
        class="shadow-sm"
        stacked="lg"
        hover
        :items="strategies"
        :fields="fields"
        id="datatable"
        :thead-tr-class="'text-uppercase'"
      >
        <template #cell(strategy_name)="data">
          <nuxt-link to="/pre-match-alerts/stats" class="text-dark">
            {{ data.value }}
          </nuxt-link>
        </template>
        <template #cell(updatedAt)="data">
          {{ $moment(data.value).format("LL") }}
        </template>

        <template #cell(hit_rate)="data">
          <span :class="$getColor(data.value, 'text-')">
            {{ data.value }}%
          </span>
        </template>

        <template #cell(active)="data">
          <b-form-checkbox v-model="data.value" name="check-button" switch>
          </b-form-checkbox>
        </template>
        <template #cell(trusted)="data">
          <b-dropdown
            size="sm"
            class="status-button"
            :class="data.value ? '' : 'testing'"
            no-caret
          >
            <template slot="button-content">
              {{ data.value ? "Trusted" : "Testing" }}

              <span class="material-icons-outlined"> expand_more </span>
            </template>
            <b-dropdown-item-button>Testing</b-dropdown-item-button>
            <b-dropdown-item-button>Trusted</b-dropdown-item-button>
          </b-dropdown>
        </template>

        <template #cell(actions)="data">
          <b-dropdown split size="sm" text="View" class="actions-dropdown">
            <b-dropdown-item :to="'/pre-match-alerts/edit/' + data.item.id"
              >Edit</b-dropdown-item
            >
            <!-- <b-dropdown-item href="#">Track</b-dropdown-item> -->
            <b-dropdown-item href="#">Clone</b-dropdown-item>
            <b-dropdown-item href="#">Share</b-dropdown-item>
            <b-dropdown-item @click="deleteStrategy(data.item.id)">
              <span class="text-danger">Delete </span>
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    strategies: Array,
    type: String
  },
  data() {
    return {
      fields: [
        { key: "title", label: "Strategy name" },
        "hit_rate",
        "fixtures_found",
        { key: "updatedAt", label: "Last opened" },
        { key: "trusted", label: "Status" },
        "active",
        "actions"
      ]
    };
  },
  methods: {
    deleteStrategy(id) {
      if (confirm("Are you sure you want to delete this filter?")) {
        this.$emit("deleteStrategy", id);
      }
    }
  }
};
</script>

<style></style>
