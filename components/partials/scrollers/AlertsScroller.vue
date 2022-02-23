<template>
  <div>
    <footy-tab-select
      v-model="createdBy"
      :options="createdByOptions"
      id="quick-alerts"
    >
    </footy-tab-select>
    <b-table
      hover
      :items="alerts"
      :fields="fields"
      small
      borderless
      thead-class="text-uppercase text-grey"
    >
      <template #cell(status)="data">
        <div v-if="data.value == 'Sent'" class="text-primary">
          <span class="material-icons mr-2" style="font-size: 17px">
            check_circle </span
          ><span>{{ data.value }} </span>
        </div>
        <div v-else class="text-grey">
          <span class="material-icons mr-2" style="font-size: 17px">
            close
          </span>
          <span>{{ data.value }} </span>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import quickAlerts from "~/components/json/quick-alerts.json";
import FootyTabSelect from '../../common/FootyTabSelect.vue';
export default {
  components: { FootyTabSelect },
  data() {
    return {
      createdByOptions: ["Yours", "Latest"],
      createdBy: "Yours",
      quickAlerts,
      fields: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "status",
          label: "Status",
          class: "text-right",
        },
      ],
    };
  },
  computed: {
    alerts() {
      return quickAlerts[this.createdBy.toLowerCase()];
    },
  },
};
</script>
