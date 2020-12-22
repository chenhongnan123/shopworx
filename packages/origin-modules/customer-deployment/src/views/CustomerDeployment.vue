<template>
  <div style="height:100%">
      <portal to="app-header">
        Deployment
      </portal>
      <v-fade-transition mode="out-in">
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
        <div v-else>
          Welcome
        </div>
      </v-fade-transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CustomerDeployment',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('user', ['me']),
  },
  async created() {
    this.loading = true;
    await this.initElements();
    this.loading = false;
  },
  methods: {
    ...mapActions('customerDeployment', ['initElements']),
  },
  watch: {
    me(val) {
      console.log(val);
    },
  },
};
</script>
