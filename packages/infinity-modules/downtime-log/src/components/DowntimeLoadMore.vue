<template>
  <v-row v-if="downtimeList.length">
    <v-col cols="12" class="text-center">
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <v-btn
        v-else-if="!loading && moreRecords"
        color="primary"
        class="text-none"
        @click="loadMore"
      >
        Load more
      </v-btn>
      <div class="title" v-else>
        That's all folks!
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'DowntimeLoadMore',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', ['downtimeList', 'downtimeCount']),
    moreRecords() {
      return this.downtimeList.length < this.downtimeCount;
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['incrementPageNumber']),
    ...mapActions('downtimeLog', ['fetchDowntimeList']),
    async loadMore() {
      this.loading = true;
      this.incrementPageNumber();
      await this.fetchDowntimeList();
      this.loading = false;
    },
  },
};
</script>
