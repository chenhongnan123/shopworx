<template>
  <div>
    <template v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
      <span>
        Fetching master data from ShopWorx servers
      </span>
    </template>
    <template v-else-if="error">
      We couldn't fetch master data from ShopWorx servers.
      Please
      <a
        @click="fetchMaster"
        class="primary--text font-weight-medium"
      >
        retry.
      </a>
    </template>
    <v-list v-else class="pa-0">
      <v-list-item
        :key="index"
        class="pa-0"
        v-for="(list, index) in masterList"
      >
        <v-list-item-icon>
          <v-progress-circular
            indeterminate
            v-if="list.loading"
          ></v-progress-circular>
          <template v-else>
            <v-icon
              color="success"
              v-if="list.success"
            >
              mdi-check-circle-outline
            </v-icon>
            <v-icon
              v-else
              color="error"
            >
              mdi-alert-circle-outline
            </v-icon>
          </template>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">
            {{ list.title }}
          </v-list-item-title>
          <review-master-data
            :data="{ ...list, index }"
            :files="files"
            @on-review="onReview"
            @on-loading="onLoading"
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ReviewMasterData from './ReviewMasterData.vue';

export default {
  name: 'ProcessMasterData',
  props: {
    files: {
      type: FileList,
      required: true,
    },
  },
  components: {
    ReviewMasterData,
  },
  data() {
    return {
      error: false,
      masterList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState('setup', ['masterData']),
  },
  created() {
    this.fetchMaster();
  },
  methods: {
    ...mapActions('setup', ['getMasterData']),
    async fetchMaster() {
      this.loading = true;
      const success = await this.getMasterData();
      if (success) {
        this.masterList = this.masterData;
      }
      this.error = !success;
      this.loading = false;
    },
    onReview(obj) {
      this.masterList[obj.index].success = obj.success;
      if (this.masterList.every((v) => v.success)) {
        this.$emit('success');
      }
    },
    onLoading(obj) {
      this.masterList[obj.index].loading = obj.loading;
    },
  },
};
</script>
