<template>
  <div style="height:100%">
    <template v-if="!id">
      <portal to="app-header">
        <span>Planning</span>
        <v-btn icon small class="ml-4 mb-1">
          <v-icon
            v-text="'$info'"
          ></v-icon>
        </v-btn>
        <v-btn icon small class="ml-2 mb-1">
          <v-icon
            v-text="'$settings'"
          ></v-icon>
        </v-btn>
        <v-btn
          icon
          small
          v-if="planView === 0"
          class="ml-2 mb-1"
          @click="enterFullscreen"
        >
          <v-icon
            v-text="'$fullscreen'"
          ></v-icon>
        </v-btn>
      </portal>
      <portal
        to="app-extension"
        v-if="onboarded && !loading"
      >
        <v-tabs
          dense
          center-active
          v-model="view"
        >
          <v-tab class="text-none">
            Dashboard
          </v-tab>
          <v-tab class="text-none">
            Calendar
          </v-tab>
          <v-tab class="text-none">
            Schedule
          </v-tab>
        </v-tabs>
      </portal>
    </template>
    <portal to="app-header" v-else>
      <v-btn
        icon
        v-if="!$vuetify.breakpoint.mdAndDown"
        @click="$router.back()"
      >
        <v-icon v-text="'$left'"></v-icon>
      </v-btn>
      <span>Plan: {{ id }}</span>
    </portal>
    <planning-loading v-if="loading" />
    <template v-else>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import PlanningLoading from './PlanningLoading.vue';

export default {
  name: 'Planning',
  components: {
    PlanningLoading,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('planning', ['onboarded', 'isFullScreen', 'planView']),
    id() {
      return this.$route.params.id;
    },
    view: {
      get() {
        return this.planView;
      },
      set(val) {
        this.setPlanView(val);
      },
    },
  },
  async created() {
    this.loading = true;
    const view = localStorage.getItem('planView');
    this.setPlanView(view ? JSON.parse(view) : 0);
    const appId = localStorage.getItem('appId');
    await this.getAppSchema(appId);
    const element = await this.getPlanningElement();
    if (element) {
      this.setOnboarded(true);
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  watch: {
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
    planView(val) {
      localStorage.setItem('planView', val);
    },
  },
  methods: {
    ...mapMutations('planning', ['setOnboarded', 'setFullScreen', 'setPlanView']),
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('planning', ['getPlanningElement']),
    enterFullscreen() {
      const elem = document.querySelector('#planning-dashboard');
      elem.onfullscreenchange = (event) => {
        const e = event.target;
        this.setFullScreen(document.fullscreenElement === e);
      };
      if (document.fullscreenEnabled) {
        if (!this.isFullScreen) {
          elem.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    },
  },
};
</script>
