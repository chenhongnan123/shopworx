<template>
  <div>
    <planning-init v-if="!isOnboardingComplete" />
    <template v-else>
      <planning-toolbar />
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PlanningToolbar from '../components/PlanningToolbar.vue';
import PlanningInit from './PlanningInit.vue';

export default {
  name: 'PlanningContainer',
  components: {
    PlanningToolbar,
    PlanningInit,
  },
  computed: {
    ...mapState('planning', ['isOnboardingComplete']),
  },
  async created() {
    this.loading = true;
    await this.initOnboarding();
    this.loading = false;
  },
  methods: {
    ...mapActions('planning', ['initOnboarding']),
  },
};
</script>
