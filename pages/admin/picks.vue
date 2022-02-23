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
      Picks
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
        <span class="mr-2">
          Subscription
        </span>
        <b-badge
          v-if="!edit_user_form.subscription"
          variant="grey"
          class="footy-badge "
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
        <b-badge v-else variant="success" class="footy-badge">
          Pro
        </b-badge>
      </div>

      <br />
      <div v-if="!issue_mode">
        <b-button class="footy-button" @click="issue_mode = true"
          >Issue a subscription</b-button
        >
      </div>
      <div v-else>
        <h4>Picks</h4>
        <b-table :items="picks" class="my-4" borderless :fields="picks_fields">
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
export default {
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
        "actions"
      ],
      picks_fields: ["id", "name", "price", "days", "trial", "actions"],
      edit_mode: false,
      add_mode: false,
      edit_user_form: {
        id: null,
        firstname: null,
        lastname: null,
        email: null,
        subscription: null
      },
      picks: [],
      issue_mode: false,
      form: {}
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

    async fetchPicks() {
      try {
        const picks = await this.$axios.$get("/admin/picks");
        this.picks = picks;
      } catch (error) {
        console.log(error);
      }
    },
    toggleEditMode(index) {
      Object.assign(this.edit_user_form, this.users[index]);
      this.edit_mode = !this.edit_mode;
    },
    toggleAddMode() {
      this.add_mode = !this.add_mode;
    },
    async issueSubscription(email, pick_id) {
      try {
        const subscription = await this.$axios.$post(
          "/admin/users/issue-subscription",
          { email, pick_id }
        );
      } catch (error) {
        console.log(error);
      } finally {
        this.issue_mode = false;
        this.edit_mode = false;
      }
    }
  },
  mounted() {
    this.fetchPicks();
  }
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
