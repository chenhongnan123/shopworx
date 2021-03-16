<template>
  <v-card flat>
    <v-card-text class="ml-4">
      <v-row
        no-gutters
        v-for="(app, n) in apps"
        :key="n"
        class="title"
      >
        {{ app.payload.webAppDescription }}
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Apps',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      apps: [{
        isComplete: false,
        isLoading: false,
        payload: {
          webAppName: 'home',
          webAppDescription: 'Home',
          iconURL: '$home',
          webAppLink: 'user-dashboard',
          moduleId: 225,
          defaultSchema: '',
        },
      }, {
        isComplete: false,
        isLoading: false,
        payload: {
          webAppName: 'productionPlanning',
          webAppDescription: 'Production Planning',
          iconURL: '$productionPlanning',
          webAppLink: 'production-planning',
          moduleId: 225,
          defaultSchema: '[{"assetId":2,"primaryDisplayTag":"planid","partMatrixComposition":["part","machine","mold"]},{"assetId":3,"primaryDisplayTag":"planid","partMatrixComposition":["part","machine","tool"]}]',
        },
      }, {
        isComplete: false,
        isLoading: false,
        payload: {
          webAppName: 'productionLog',
          webAppDescription: 'Production Log',
          iconURL: '$productionLog',
          webAppLink: 'production-log',
          moduleId: 225,
          defaultSchema: '',
        },
      }, {
        isComplete: false,
        isLoading: false,
        payload: {
          webAppName: 'downtimeLog',
          webAppDescription: 'Downtime Log',
          iconURL: '$downtimeLog',
          webAppLink: 'downtime-log',
          moduleId: 225,
          defaultSchema: '',
        },
      }, {
        isComplete: false,
        isLoading: false,
        payload: {
          webAppName: 'liveShopfloor',
          webAppDescription: 'Shopfloor Dashboard',
          iconURL: '$shopfloorDashboard',
          webAppLink: '/dashboards/#/d/live-shopfloor',
          moduleId: 231,
          defaultSchema: '',
        },
      }],
    };
  },
  created() {
    // get all modules
  },
  watch: {
    loading(val) {
      if (val) {
        console.log('apps');
        setTimeout(() => {
          this.$emit('on-complete');
        }, 3000);
      }
    },
  },
};
</script>
