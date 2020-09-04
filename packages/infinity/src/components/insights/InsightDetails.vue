<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0 px-2 font-weight-medium text-justify">
      <span>You asked:&nbsp;</span>
      <span v-text="query.name"></span>
    </v-card-text>
    <v-progress-linear :indeterminate="true"></v-progress-linear>
    <v-card-text class="text-center">
      <v-row align="center" no-gutters style="height: 100%">
        <v-col cols="12">
          <div class="title font-weight-regular">
            Insight detail here.
          </div>
          <div class="subheading">
            Check back soon!
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InsightDetails',
  computed: {
    ...mapState('insight', ['query']),
  },
};
</script>
