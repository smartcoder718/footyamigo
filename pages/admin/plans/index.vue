<template>
  <div>
    <b-row>
      <b-col cols="12">
        <b-button class="footy-button" @click="toggleAddMode">
          Add plan
        </b-button>

        <b-table :items="plans" class="my-4" borderless :fields="fields">
          <template #cell(trial)="data">
            <b-badge v-if="data.value" variant="grey" class="footy-badge w-50">
              Trial
            </b-badge>
            <b-badge v-else variant="success" class="footy-badge w-50">
              Pro
            </b-badge>
          </template>
          <template #cell(actions)="data">
            <b-button class="footy-button" @click="toggleEditMode(data.index)">
              Edit Plan
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-modal v-model="add_mode" title="Add a plan" hide-footer>
      <b-form class="add-plan-form">
        <label for="form-name">Name</label>
        <b-input v-model="form.name" id="form-name" class="footy-input">
        </b-input>
        <label for="form-price">Price</label>
        <b-input v-model="form.price" id="form-price" class="footy-input">
        </b-input>
        <label for="form-validity">Validity (days)</label>
        <b-input v-model="form.days" id="form-validity" class="footy-input">
        </b-input>
        <label for="form-trial">Is trial ?</label>
        <br />
        <footy-switch v-model="form.trial" id="form-trial"> </footy-switch>
      </b-form>
      <b-row>
        <b-col>
          <b-button
            class="mt-3 footy-button"
            variant="secondary"
            block
            @click="toggleAddMode"
            >Cancel</b-button
          >
        </b-col>
        <b-col>
          <b-button
            class="mt-3 footy-button"
            variant="success"
            block
            @click="addPlan"
            >Done</b-button
          >
        </b-col>
      </b-row>
    </b-modal>
    <b-modal v-model="edit_mode" title="Edit plan" hide-footer>
      <b-form class="add-plan-form">
        <input type="hidden" :value="edit_plan_form.id" />
        <label for="form-name">Name</label>
        <b-input
          v-model="edit_plan_form.name"
          id="form-name"
          class="footy-input"
        >
        </b-input>
        <label for="form-price">Price</label>
        <b-input
          v-model="edit_plan_form.price"
          id="form-price"
          class="footy-input"
        >
        </b-input>
        <label for="form-validity">Validity (days)</label>
        <b-input
          v-model="edit_plan_form.days"
          id="form-validity"
          class="footy-input"
        >
        </b-input>
        <label for="form-trial">Is trial ?</label>
        <br />
        <footy-switch v-model="edit_plan_form.trial" id="form-trial">
        </footy-switch>
      </b-form>
      <b-row>
        <b-col>
          <b-button
            class="mt-3 footy-button"
            variant="secondary"
            block
            @click="edit_mode = false"
            >Cancel</b-button
          >
        </b-col>
        <b-col>
          <b-button
            class="mt-3 footy-button"
            variant="success"
            block
            @click="editPlan"
            >Done</b-button
          >
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import FootySwitch from "../../../components/common/FootySwitch.vue";
export default {
  components: { FootySwitch },
  layout: "admin",
  data() {
    return {
      plans: [],
      form: {
        days: 30,
        name: "Pro",
        price: 24.99,
        trial: false
      },
      fields: ["id", "name", "price", "days", "trial", "actions"],
      add_mode: false,
      edit_mode: false,
      edit_plan_form: {
        id: null,
        days: null,
        name: null,
        price: null,
        trial: null
      }
    };
  },
  methods: {
    async addPlan() {
      try {
        const res = await this.$axios.$post("/admin/plans/create", this.form);
        console.log(res);
        this.toggleAddMode();
        this.fetchPlans();
      } catch (error) {
        console.log(error);
      }
    },
    async editPlan() {
      try {
        const res = await this.$axios.$post(
          "/admin/plans/edit",
          this.edit_plan_form
        );
        console.log(res);
        this.edit_mode = false;
        this.fetchPlans();
      } catch (error) {
        console.log(error);
      }
    },
    async fetchPlans() {
      try {
        const plans = await this.$axios.$get("/admin/plans");
        this.plans = plans;
      } catch (error) {
        console.log(error);
      }
    },
    toggleAddMode() {
      this.add_mode = !this.add_mode;
    },
    toggleEditMode(index) {
      Object.assign(this.edit_plan_form, this.plans[index]);
      this.edit_mode = !this.edit_mode;
    }
  },
  mounted() {
    this.fetchPlans();
  }
};
</script>

<style lang="scss">
.add-plan-form {
  .footy-input {
    margin-bottom: 10px;
  }
}
</style>
