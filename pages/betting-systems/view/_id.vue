<template>
  <GeneralPage
    :pageTitle="system.title"
    :pageDescription="system.description"
    v-if="!loading"
  >
    <template v-slot:pageButton>
      {{ "" }}
    </template>
    <template v-slot:howItWorks> {{ "" }} </template>
    <hr class="betting-systems-hr" />
    <b-row no-gutters>
      <b-col lg="8" md="12">
        <div class="betting-systems-container ">
          <div class="betting-systems-video-wrapper d-flex row-gap-20 flex-col">
            <div v-html="system.video_embed"></div>
            <h6 class="text-grey fw-normal">
              {{ system.video_description }}
            </h6>
          </div>
        </div>
      </b-col>

      <b-col lg="4" md="12" class="systems-info">
        <div class="betting-systems-container ">
          <div class="mb-4 row-gap-10 flex-col">
            <h4 class="header-size-2">What you will learn</h4>
            <h6 class="text-grey fw-normal">
              {{ system.learn }}
            </h6>
            <b-badge block class="betting-systems-roi">
              <h6 class="text-primary">
                Return on Investment: {{ system.roi }}%
              </h6>
            </b-badge>
          </div>
          <div class="recommended-alert-preset row-gap-10 flex-col">
            <h4 class="header-size-2">Recommended Alert Preset</h4>

            <div
              class="preset"
              v-for="preset in system.presets"
              :key="preset.title"
            >
              <h4 class="sub-heading text-dark">{{ preset.title }}</h4>
              <!-- <h4 class="sub-heading text-primary">
                Hit Rate: {{ preset.hit_rate }}%
              </h4> -->

              <b-button
                class="import-status"
                v-if="!imported[preset.id]"
                block
                @click="promptImport(preset.id)"
                :disabled="importing[preset.id]"
                ><template v-if="importing[preset.id]">
                  Importing
                  <b-spinner variant="primary" label="Spinning" small>
                  </b-spinner>
                </template>

                <template v-else>
                  Import
                </template>
              </b-button>
              <b-button v-else class="import-status imported" block>
                Imported</b-button
              >
              <!-- <b-overlay :show="importing[preset.id]" class="p-0">
              </b-overlay> -->
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <PromptModal
      v-model="showImportPrompt"
      title="Import Strategy"
      message="As with all football tips and betting strategies, Footy Amigo cannot guarantee results. These strategies are created and used by our team before we publish them and we're very confident in their ability to be profitable over the long-run. Always gamble responsibly."
      @accepted="importStrategy"
      :hideCancel="true"
      buttonGroupClass="centered"
    >
    </PromptModal>
  </GeneralPage>
</template>
<script>
export default {
  data() {
    return {
      system: {
        title: "",
        description: "",
        roi: "",
        video_embed: "",
        video_description: "",
        learn: "",
        presets: []
      },
      imported: {},
      importing: {},
      loading: true,
      showImportPrompt: false,
      importId: null
    };
  },
  mounted() {
    this.fetchBettingSystem(this.$route.params.id);
  },
  methods: {
    async fetchBettingSystem(id) {
      try {
        this.loading = true;
        const params = {
          id
        };
        const betting_system = await this.$axios.$get(
          "/user/betting-systems/id",
          { params }
        );
        this.system = betting_system;
      } catch (error) {
        console.error(error);
        this.$router.push("/betting-systems");
      } finally {
        this.loading = false;
      }
    },

    async promptImport(id) {
      this.showImportPrompt = true;
      this.importId = id;
    },
    async importStrategy(id) {
      try {
        const id = this.importId;
        this.$set(this.importing, id, true);
        await this.$axios.importBettingSystem(id);
        this.$set(this.imported, id, true);
      } catch (error) {
        console.error(error);
      } finally {
        this.importing[id] = false;
      }
    }
  }
};
</script>
<style lang="scss">
@import "~/assets/scss/colors";
@import "~assets/scss/breakpoints";
.betting-systems-video {
  margin-bottom: 16px;
}
@media only screen and (min-width: $lg) {
  .systems-info {
    padding-left: 30px !important;
  }
  .betting-systems-video-wrapper {
    margin: 10px;
  }
  .betting-systems-video {
    margin-bottom: 24px;
  }
}
.systems-info {
  background: white;
  .heading {
    font-weight: bold !important; //COLFAX
    font-size: 20px;
    line-height: 30px;
    /* identical to box height */

    display: flex;
    align-items: center;

    /* text-1 */

    color: $dark-1;
  }

  .sub-heading {
    font-weight: bold !important; //COLFAX
    font-size: 16px;
    line-height: 24px;
    /* identical to box height */

    display: flex;
    align-items: center;

    /* text-1 */

    color: $dark-1;
  }
  .roi {
    font-weight: bold !important; //COLFAX
    font-size: 14px;
    line-height: 21px;
    /* identical to box height */

    display: flex;
    align-items: center;

    /* green */
    padding: 3px 8px 2px;
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

.recommended-alert-preset {
  .preset {
    background: #ffffff;
    border: 1px solid #f0f1f0;
    padding: 16px 18px;
    margin-bottom: 10px;
    display: grid;
    gap: 14px;
  }
  .import-button {
    background: #eef5ed;
    border-radius: 12px;

    font-weight: bold !important; //COLFAX
    font-size: 13px;
    line-height: 18px;
    /* identical to box height, or 138% */

    text-align: center;

    /* text-1 */

    color: $dark-1;
  }
  .import-status {
    background: #eef5ed;
    border-radius: 12px;

    font-weight: bold !important; //COLFAX
    font-size: 13px;
    line-height: 18px;
    /* identical to box height, or 138% */
    padding: 10px;
    text-align: center;

    /* text-1 */

    color: $dark-1;
    &.imported {
      background: #60b15a;
      color: white;
    }
  }
}
</style>
