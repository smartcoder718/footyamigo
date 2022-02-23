<template>
  <div class="subscription-tab">
    <section class="subscriptions" v-if="hasSubscription">
      <h3 class="sub-heading">Subscriptions</h3>
      <!-- Subscription Table -->
      <b-table
        class="subscriptions-table common-table d-lg-table d-none"
        stacked="lg"
        hover
        :fields="subscription_fields"
        :items="[subscription]"
        id="datatable"
        :thead-tr-class="'text-uppercase'"
        borderless
      >
        <template #head(end_date)="">
          {{ subscription.cancel_url ? "Next Payment" : "Expires At" }}
        </template>
        <template #cell(id)="data"> #{{ data.value }} </template>
        <template #cell(status)="data">
          <b-badge
            :variant="data.value == 'active' ? 'primary' : 'dangerous'"
            class="footy-badge text-uppercase"
            >{{ data.value }}</b-badge
          >
        </template>
        <template #cell(end_date)="data">
          {{ $moment.utc(data.value).local().format("LL") }}
        </template>
        <template #cell(price)="data">
          £{{ data.value }} per
          {{ subscription.days == 1 ? "day" : subscription.days + " days" }}
        </template>
        <template #cell(actions)="data">
          <b-button-group class="w-100" style="column-gap: 16px">
            <b-button
              variant="secondary"
              class="footy-button mr-2"
              @click="openPaddleFrame(data.item.update_url)"
              :disabled="!data.item.update_url"
              >Update</b-button
            >
            <b-button
              variant="dangerous"
              class="footy-button "
              :disabled="!data.item.cancel_url"
              @click="toggleCancelPro"
              >Cancel</b-button
            >
          </b-button-group>
          <!--b-button
            variant="secondary"
            class="footy-button"
            :href="data.item.receipt_url"
            target="_blank"
            v-else
            >|</b-button
          -->
        </template>
      </b-table>
      <!-- Mobile Table -->
      <section class="d-block d-lg-none">
        <div
          class="mobile-table-container mobile-subscriptions-table"
          v-for="(subscription, i) in subscriptions"
          :key="i"
        >
          <div class="field">
            <h3 class="field-heading">Subscription ID</h3>
            <p class="field-value">#{{ subscription.id }}</p>
          </div>
          <div class="field">
            <h3 class="field-heading">Plan</h3>
            <p class="field-value">
              {{ subscription.name }}
            </p>
          </div>
          <div class="field">
            <h3 class="field-heading">Status</h3>
            <p class="field-value">
              <b-badge
                :variant="
                  subscription.status == 'active' ? 'primary' : 'dangerous'
                "
                class="footy-badge text-uppercase"
                >{{ subscription.status }}</b-badge
              >
            </p>
          </div>
          <div class="field">
            <h3 class="field-heading">
              {{ subscription.cancel_url ? "Next Payment" : "Expires At" }}
            </h3>
            <p class="field-value">
              {{ $moment.utc(subscription.end_date).local().format("LL") }}
            </p>
          </div>
          <div class="field">
            <h3 class="field-heading">price</h3>
            <p class="field-value">
              £{{ subscription.price }} per
              {{ subscription.days == 1 ? "day" : subscription.days + " days" }}
            </p>
          </div>

          <b-button-group class="w-100" style="column-gap: 16px">
            <b-button
              variant="secondary"
              class="footy-button mr-2"
              @click="openPaddleFrame(subscription.update_url)"
              target="_blank"
              :disabled="!subscription.update_url"
              >Update</b-button
            >

            <b-button
              variant="dangerous"
              class="footy-button "
              @click="toggleCancelPro"
              :disabled="!subscription.cancel_url"
              >Cancel</b-button
            >
          </b-button-group>
          <!--b-button
            variant="secondary"
            class="footy-button w-100"
            :href="subscription.receipt_url"
            target="_blank"
            v-else
            >Payment Receipt</b-button
          -->
        </div>
      </section>
      <b-modal
        content-class="shadow rounded-sm border-0"
        v-model="showCancel"
        body-bg-variant="light"
        hide-footer
        hide-header
        size="lg"
        body-class="rounded-modal"
        modal-class="footy-modal"
      >
        <div class="footy-modal-header">
          <h2 class="footy-modal-title mb-3">We’re sad to see you go 😢</h2>
          <div>
            <b-button
              variant="white"
              @click="showCancel = false"
              class="footy-button"
            >
              <CloseIcon />
            </b-button>
          </div>
        </div>

        <div class="footy-modal-content">
          <div class="mb-3">
            By cancelling your Footy Amigo subscription...
          </div>
          <ul class="list-unstyled mb-3">
            <li>
              ❌ You will NOT be able to receive alerts to your Telegram
              anymore.
            </li>
            <li>
              ❌ You will LOSE access to your created strategies.
            </li>
            <li>
              ❌ You will NOT be able to create new Prematch or Inplay
              Strategies.
            </li>
            <li>
              ❌ You will have LIMITED access to the Bet Builder Page.
            </li>
            <li>
              ❌ You will have LIMITED access to lots of tools on the Fixture
              page.
            </li>
          </ul>

          <div class="mb-5">
            PS: If you still choose to cancel, nothing in your account will be
            lost, it will just be temporarily frozen until you have an active
            PRO subscription.
          </div>
          <b-button
            variant="dangerous"
            block
            class="footy-button "
            :disabled="!subscription.cancel_url"
            @click="openPaddleFrame(subscription.cancel_url)"
            >Cancel PRO</b-button
          >
        </div>
      </b-modal>
    </section>

    <section class="payments" v-if="hasSubscription && transaction">
      <h3 class="sub-heading">Payments</h3>
      <!-- Payments Table -->
      <b-table
        class="payments-table common-table d-lg-table d-none"
        stacked="lg"
        hover
        :fields="payment_fields"
        :items="payments"
        id="datatable"
        borderless
        :thead-tr-class="'text-uppercase'"
      >
        <template #cell(id)="data"> #{{ data.value }} </template>
        <template #cell(created_at)="data">
          {{ $moment(data.value).format("LL") }}
        </template>
        <template #cell(price)="data">
          <span id="amount-popover-md"> {{ data.item.amount_usd }} USD </span>
          <b-popover
            target="amount-popover-md"
            triggers="hover"
            placement="right"
            variant="primary"
            custom-class="footy-popover"
          >
            {{ data.item.amount }} {{ data.item.currency }}
          </b-popover>
        </template>

        <template #cell(actions)="data">
          <b-button
            variant="secondary"
            class="footy-button"
            :href="data.item.receipt_url"
            target="_blank"
            ><span class="mr-2">
              <img :src="`/icons/download.svg?inline`" alt="" /> </span
            >Download</b-button
          >
        </template>
      </b-table>
      <!-- Mobile Payment Table -->
      <section class="d-block d-lg-none">
        <div
          class="mobile-table-container mobile-payments-table"
          v-for="(filter, i) in payments"
          :key="i"
        >
          <div class="field">
            <h3 class="field-heading">Payment ID</h3>
            <p class="field-value">{{ filter.payment_id }}</p>
          </div>
          <div class="field">
            <h3 class="field-heading">Subscription ID</h3>
            <p class="field-value">{{ filter.subscription_id }}</p>
          </div>
          <div class="field">
            <h3 class="field-heading">Amount</h3>
            <p class="field-value">
              <span id="amount-popover-sm"> {{ filter.amount_usd }} USD </span>
              <b-popover
                target="amount-popover-sm"
                triggers="hover"
                placement="right"
                variant="primary"
                custom-class="footy-popover"
              >
                {{ filter.amount }} {{ filter.currency }}
              </b-popover>
            </p>
          </div>
          <div class="field">
            <h3 class="field-heading">Date</h3>
            <p class="field-value">
              {{ $moment(filter.date).local().format("LLL") }}
            </p>
          </div>

          <b-row no-gutters>
            <b-col cols="12">
              <b-button variant="secondary" class="footy-button" block
                ><span class="mr-2">
                  <img :src="`/icons/download.svg?inline`" alt="" /> </span
                >Download</b-button
              >
            </b-col>
          </b-row>
        </div>
      </section>
    </section>
    <BuySubcription v-if="!hasSubscription"> </BuySubcription>
  </div>
</template>

<script>
import CloseIcon from "@/static/icons/close.svg";
import BuySubcription from "./BuySubcription.vue";
export default {
  head: {
    script: [
      {
        src: "https://cdn.paddle.com/paddle/paddle.js",
        defer: true
      }
    ]
  },
  data() {
    return {
      transaction: null,
      showCancel: false,
      subscription_fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Plan" },
        "status",
        { key: "end_date", label: "Next Payment" },
        "price",
        "actions"
      ],
      payment_fields: [
        { key: "id", label: "ID" },
        { key: "subscription_id", label: "Subscription ID" },
        { key: "price", label: "Amount" },
        { key: "created_at", label: "Date" },
        "actions"
      ]
    };
  },
  components: {
    CloseIcon,
    BuySubcription
  },

  mounted() {
    this.fetchLastPayment();
  },
  methods: {
    async fetchLastPayment() {
      const transaction = await this.$axios.$get("/user/transactions/latest");
      this.transaction = transaction;
    },
    async openPaddleFrame(override) {
      this.showCancel = false;
      Paddle.Setup({ vendor: 1 });
      Paddle.Checkout.open({
        override
      });
    },
    toggleCancelPro() {
      this.showCancel = true;
    }
  },
  computed: {
    hasSubscription() {
      return this.subscription && !this.subscription.trial;
    },
    subscription() {
      return this.$auth.user.subscription;
    },
    subscriptions() {
      return [this.subscription];
    },
    payments() {
      return [this.transaction];
    }
  }
};
</script>

<style lang="scss">
.footy-popover {
  border: none;
}
.subscription-tab {
font-weight: 500;
  .sub-heading {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #11142d;
    margin-bottom: 29px;
  }
  .subscriptions-table {
    border: 1px solid #f0f1f0 !important;
    tbody {
      tr {
        background: #ffffff;
        border: none !important;
        td {
          &:nth-child(2) {
            color: #60b15a !important;
          }
        }
        td {
          // color: #222622 !important;
          > div {
            // font-weight: 600 !important;
          }
        }
      }
    }
    th > div {
      // font-weight: 600 !important;
    }
  }
  .payments-table {
    tbody {
      tr {
        background: #ffffff;
        border: 1px solid #f0f1f0 !important;
        // margin-bottom: 10px !important;

        td {
          // color: #222622 !important;
          > div {
            // font-weight: 600 !important;
          }
        }
      }
    }
    th > div {
      // font-weight: 600 !important;
    }
    th {
      &:first-child {
        padding-left: 0px;
      }
    }
  }
}
</style>
