<template>
  <div style="height: 100%">
    <v-container fill-height v-if="loading">
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="12" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="72"
          ></v-progress-circular>
        </v-col>
        <v-col cols="12" align="center">
          <div class="headline">
            To the customer, you are the company.
          </div>
          <div class="title">
            Setting up deployment environment
          </div>
        </v-col>
      </v-row>
    </v-container>
    <template v-else>
      <sse-state />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SseState from '../components/SseState.vue';

export default {
  name: 'DeploymentIndex',
  components: {
    SseState,
  },
  data() {
    return {
      loading: false,
    };
  },
  async created() {
    if (this.user) {
      this.loading = true;
      await this.initElements();
      this.loading = false;
    }
  },
  computed: {
    ...mapState('user', ['me']),
  },
  methods: {
    ...mapActions('customerDeployment', ['initElements']),
  },
};
</script>
