<template>
  <div class="betting-systems">
    <section class="betting-systems-page-header">
      <b-row no-gutters>
        <b-col>
          <h1 class="betting-systems-page-title">Betting Systems</h1>
          <div class="betting-systems-page-description">
            Any successful football bettor has a system they follow. We have
            spent time creating these profitable, rigorously tested betting
            systems for our users. The systems below require discipline,
            patience an active Footy Amigo subscription.
          </div>
        </b-col>
      </b-row>
    </section>
    <hr class="betting-systems-hr"  />
    <div class="blurred-content-box">
      <b-row align-h="center" class="page-content-box blurred">
        <b-col
          v-for="system in systems"
          :key="system.title"
          md="4"
          sm="6"
          cols="12"
        >
          <div class="card-holder">
            <h4 class="title">{{ system.title }}</h4>
            <p class="content">
              {{ system.content }}
            </p>
            <b-button block class="roi"> ROI: {{ system.roi }}% </b-button>
          </div>
        </b-col>
      </b-row>
      <div class="subscription-box">
        <div class="text-center">
          Upgrade to Pro version to see the content
        </div>
        
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      systems: [
        {
          title: "Upgrade your account first",
          content:
            "Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade.Content can be viewed after ugrade. Content can be viewed after ugrade.",
          roi: 1000,
        },
        {
          title: "Upgrade your account first",
          content:
            "Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade.Content can be viewed after ugrade. Content can be viewed after ugrade.",
          roi: 1000,
        },
        {
          title: "Upgrade your account first",
          content:
            "Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade.Content can be viewed after ugrade. Content can be viewed after ugrade.",
          roi: 1000,
        },
        {
          title: "Upgrade your account first",
          content:
            "Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade.Content can be viewed after ugrade. Content can be viewed after ugrade.",
          roi: 1000,
        },
        {
          title: "Upgrade your account first",
          content:
            "Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade.Content can be viewed after ugrade. Content can be viewed after ugrade.",
          roi: 1000,
        },
        {
          title: "Upgrade your account first",
          content:
            "Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade. Content can be viewed after ugrade.Content can be viewed after ugrade. Content can be viewed after ugrade.",
          roi: 1000,
        },
      ],
    };
  },
};
</script>
<style scoped lang="scss">
@import "~/assets/scss/colors";
.betting-systems {
  .blurred {
    filter: blur(10px);
  }
  .blurred-content-box {
    position: relative;
    .subscription-box {
      position: absolute;
      top : 50%;
      width: 100%;
    }
  }
  .card-holder {
    background: white;
    background: #ffffff;
    border: 1px solid #cfd8cf;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    .title {

      font-weight: bold !important; //COLFAX
      font-size: 18px;
      line-height: 30px;
      /* identical to box height */

      display: flex;
      align-items: center;

      /* text-1 */

      color: $dark-1;
    }
    .content {
      font-weight: normal;
      font-size: 14px;
      line-height: 21px;

      /* text-2 */

      color: #60685f;
    }
    .roi {

      font-weight: bold !important; //COLFAX
      font-size: 14px;
      line-height: 21px;
      /* identical to box height */

      display: flex;
      align-items: center;

      /* green */

      color: #60b15a;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 3px 8px 2px;

      /* green-300 */

      background: #eef5ed;
      border-radius: 2px;
    }
  }
}
</style>