<template>
  <div>
    <portal to="app-header">
      <v-toolbar-title>
        <span class="headline font-weight-medium">Planning</span>
        <v-icon
          class="ml-4 mb-1"
          v-text="'$info'"
        ></v-icon>
        <v-icon
          class="ml-2 mb-1"
          v-text="'$settings'"
        ></v-icon>
      </v-toolbar-title>
    </portal>
    <portal to="app-tabs">
      <v-tabs center-active>
        <v-tab class="text-none">List</v-tab>
        <v-tab class="text-none">Calendar</v-tab>
      </v-tabs>
    </portal>
    Plans
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Planning',
  created() {
    this.setExtendedHeader(true);
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
