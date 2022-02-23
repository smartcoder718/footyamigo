<template>
  <div>
    <b-row>
      <b-col cols="12">
        <b-button class="footy-button" @click="toggleAddMode">
          Add user
        </b-button>

        <b-table
          :items="users"
          class="my-4"
          :fields="fields"
          borderless
          stacked="lg"
        >
          <template #cell(subscription)="data">
            <b-badge v-if="!data.value" variant="grey" class="footy-badge">
              Inactive
            </b-badge>
            <b-badge
              v-else-if="data.value.trial"
              variant="warning"
              class="footy-badge"
            >
              Trial
            </b-badge>
            <b-badge v-else variant="success" class="footy-badge">
              Pro
            </b-badge>
          </template>
          <template #cell(created_at)="data">
            {{ $moment(data.value).format("LL") }}
          </template>
          <template #cell(actions)="data">
            <b-button class="footy-button" @click="toggleEditMode(data.index)">
              Edit User
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-modal v-model="add_mode" title="Add a user" hide-footer>
      <b-form class="add-user-form">
        <label for="form-firstname">First Name</label>
        <b-input
          v-model="form.firstname"
          id="form-firstname"
          class="footy-input"
        >
        </b-input>
        <label for="form-lastname">Last Name</label>
        <b-input v-model="form.lastname" id="form-lastname" class="footy-input">
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
            @click="addUser"
            >Done</b-button
          >
        </b-col>
      </b-row>
    </b-modal>
    <b-modal
      v-model="edit_mode"
      class="footy-modal"
      hide-footer
      title="Edit User"
    >
      Plans
    </b-modal>

    <b-modal
      v-model="edit_mode"
      class="footy-modal"
      hide-footer
      title="Edit User"
      size="lg"
    >
      <b-form class="add-user-form">
        <label for="form-firstname">First Name</label>
        <b-input
          v-model="edit_user_form.firstname"
          id="form-firstname"
          class="footy-input"
        >
        </b-input>
        <label for="form-lastname">Last Name</label>
        <b-input
          v-model="edit_user_form.lastname"
          id="form-lastname"
          class="footy-input"
        >
        </b-input>
        <label for="form-email">Email</label>
        <b-input
          v-model="edit_user_form.email"
          id="form-email"
          class="footy-input"
        >
        </b-input>
      </b-form>

      <div class="my-2">
        <span class="mr-2"> Subscription </span>
        <b-badge
          v-if="!edit_user_form.subscription"
          variant="grey"
          class="footy-badge"
        >
          Inactive
        </b-badge>
        <b-badge
          v-else-if="edit_user_form.subscription.trial"
          variant="warning"
          class="footy-badge"
        >
          Trial
        </b-badge>
        <b-badge v-else variant="success" class="footy-badge"> Pro </b-badge>
      </div>
      <div v-if="edit_user_form.subscription" class="my-2">
        <div v-if="change_expiry_mode" class="centered gap-10">
          <v-date-picker v-model="end_date" mode="dateTime" timezone="utc" />
          <b-button class="footy-button" @click="change_expiry_mode = false"
            ><span class="material-icons-outlined"> close </span>
            Cancel</b-button
          >

          <b-button
            class="footy-button"
            variant="primary"
            @click="updateExpiry(edit_user_form.email)"
          >
            <template v-if="save_loading">
              Saving <b-spinner small variant="light" type="grow" class="ml-2"> </b-spinner>
            </template>

            <template v-else
              ><span class="material-icons-outlined"> save </span>
              Save
            </template>
          </b-button>
        </div>
        <div v-else class="d-grid grid-col-md-2 gap-10">
          Expires at
          {{ $moment.utc(edit_user_form.subscription.end_date).format("lll") }}
          <b-button
            class="footy-button"
            @click="editExpiry(edit_user_form.subscription.end_date)"
            ><span class="material-icons-outlined"> mode_edit </span>
            Edit</b-button
          >
        </div>
      </div>
      <br />
      <div v-if="!issue_mode" class="d-grid grid-col-md-2 gap-10">
        <b-button class="footy-button" @click="issue_mode = true"
          >Issue a subscription</b-button
        >
        <b-button
          class="footy-button"
          @click="deleteSubscription(edit_user_form.email)"
          >Deactivate subscription</b-button
        >
      </div>
      <div v-else>
        <h4>Plans</h4>
        <b-table :items="plans" class="my-4" borderless :fields="plans_fields">
          <template #cell(trial)="data">
            <b-badge v-if="data.value" variant="grey" class="footy-badge w-100">
              Trial
            </b-badge>
            <b-badge v-else variant="success" class="footy-badge w-100">
              Pro
            </b-badge>
          </template>
          <template #cell(actions)="data">
            <b-button
              class="footy-button"
              @click="issueSubscription(edit_user_form.email, data.item.id)"
            >
              Add to user
            </b-button>
          </template>
        </b-table>
      </div>
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
      users: [],
      fields: [
        "id",
        "email",
        "firstname",
        "created_at",
        "subscription",
        "actions",
      ],
      plans_fields: ["id", "name", "price", "days", "trial", "actions"],
      edit_mode: false,
      add_mode: false,
      edit_user_form: {
        id: null,
        firstname: null,
        lastname: null,
        email: null,
        subscription: null,
      },
      save_loading: false,
      end_date: new Date(),
      change_expiry_mode: false,
      plans: [],
      issue_mode: false,
      form: {},
    };
  },
  methods: {
    async addUser() {
      try {
        const res = await this.$axios.$post("/admin/users/create", this.form);
        console.log(res);
        this.toggleAddMode();
        this.fetchUsers();
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUsers() {
      try {
        const users = await this.$axios.$get("/admin/users");
        this.users = users;
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
    editExpiry(end_date) {
      this.change_expiry_mode = true;
      this.end_date = end_date;
    },

    toggleEditMode(index) {
      Object.assign(this.edit_user_form, this.users[index]);
      this.edit_mode = !this.edit_mode;
    },
    toggleAddMode() {
      this.add_mode = !this.add_mode;
    },
    async updateExpiry(email) {
      try {
        this.save_loading = true;
        const subscription = await this.$axios.$post(
          "/admin/users/update-expiry",
          { email, end_date: this.$moment(this.end_date).utc() }
        );
      } catch (error) {
        console.log(error);
      } finally {
        this.issue_mode = false;
        this.edit_mode = false;
        this.change_expiry_mode = false;
        this.save_loading = false;
        this.fetchUsers();
      }
    },
    async issueSubscription(email, plan_id) {
      try {
        const subscription = await this.$axios.$post(
          "/admin/users/issue-subscription",
          { email, plan_id }
        );
      } catch (error) {
        console.log(error);
      } finally {
        this.issue_mode = false;
        this.edit_mode = false;
        this.fetchUsers();
      }
    },
    async deleteSubscription(email) {
      try {
        if (confirm("Are you sure you want to delete sub for this user?")) {
          const subscription = await this.$axios.$post(
            "/admin/users/delete-subscription",
            { email }
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.issue_mode = false;
        this.edit_mode = false;
        this.fetchUsers();
      }
    },
  },
  mounted() {
    this.fetchPlans();
    this.fetchUsers();
  },
};
</script>

<style lang="scss">
.add-user-form {
  .footy-input {
    margin-bottom: 10px;
  }
}

.footy-badge {
  border-radius: 4px;
}
</style>
