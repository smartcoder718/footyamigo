<template>
  <div>
    <b-row>
      <b-col cols="12">
        <h3>Page Videos</h3>
        <div>
          <b-button class="footy-button" @click="toggleShowCreate">
            Create
          </b-button>
        </div>

        <b-modal
          v-model="showCreate"
          size="xl"
          :title="`${editMode ? 'Edit' : 'Create'} Page Video`"
          hide-footer
          content-class="border-0"
        >
          <CreatePageVideo v-model="edit" v-if="editMode" />
          <CreatePageVideo v-model="create" v-else />
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
                @click="createPageVideo"
                >Done</b-button
              >
            </b-col>
          </b-row>
        </b-modal>

        <b-table :items="page_videos" :fields="fields" class="my-4" borderless>
          <template #cell(active)="data">
            <footy-switch
              v-model="data.value"
              @click.native.prevent="togglePageVideo(data.item.id)"
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
              <b-dropdown-item @click="deletePageVideo(data.item.id)">
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
import CreatePageVideo from "~/components/page-videos/CreatePageVideo.vue";
export default {
  layout: "admin",
  data() {
    return {
      page_videos: [],
      fields: ["title","location", "actions"],
      editMode: false,
      showCreate: false,
      create: {
        title: null,
        location: null,
        video_url: null
      },
      edit: {
        id: null,
        title: null,
        location: null,
        video_url: null
      }
    };
  },
  components: {
    CreatePageVideo
  },
  methods: {
    async fetchPageVideos() {
      const page_videos = await this.$axios.$get("/admin/page-videos");
      this.page_videos = page_videos;
    },
    async togglePageVideo(id) {
      const params = { id };
      const page_video = await this.$axios.$get(
        "/admin/page-videos/toggle-active",
        {
          params
        }
      );
      this.fetchPageVideos();
    },
    async createPageVideo() {
      try {
        const page_video = await this.$axios.$post(
          "/admin/page-videos/create",
          this.editMode ? this.edit : this.create
        );
        this.fetchPageVideos();
        console.log(page_video);
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
      Object.assign(this.edit, this.page_videos[index]);
      this.showCreate = !this.showCreate;
    },
    async deletePageVideo(id) {
      const params = { id };
      const page_video = await this.$axios.$get("/admin/page-videos/delete", {
        params
      });
      this.fetchPageVideos();
    }
  },
  mounted() {
    this.fetchPageVideos();
  }
};
</script>

<style></style>
