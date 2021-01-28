<template>
  <v-container fill-height>
    <v-row
      align="center"
      justify="center"
      :no-gutters="$vuetify.breakpoint.smAndDown"
    >
      <v-col cols="5" align="center">
        <v-img
          :src="require(`@shopworx/assets/illustrations/${notFoundIllustration}.svg`)"
          contain
        />
      </v-col>
      <v-col cols="12" align="center">
        <span class="headline">
          No production plan for selected filters
        </span>
      </v-col>
      <v-col cols="12" align="center">
        <v-btn
          color="primary"
          class="text-none"
          @click="addNew"
        >
          <v-icon left>mdi-plus</v-icon>
          Add new plan
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PlanningNoRecords',
  computed: {
    ...mapState('webApp', ['storageLocation']),
    notFoundIllustration() {
      return this.$vuetify.theme.dark
        ? 'not-found-dark'
        : 'not-found-light';
    },
  },
  methods: {
    addNew() {
      this.$router.push({ name: 'addProductionPlan' });
    },
  },
};
</script>
