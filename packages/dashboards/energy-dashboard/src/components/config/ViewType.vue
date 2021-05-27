<template>
  <div>
    <div>
      VIEW
    </div>
    <v-radio-group
      dense
      hide-details
      class="ma-0 pa-0"
      v-model="view"
    >
      <v-radio
        v-for="(view, n) in views"
        :key="n"
        :label="view.label"
        :value="view"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ViewType',
  data() {
    return {
      views: [{
        label: 'Hour',
        value: 'hourly',
        reportName: 'hourlyenergydashboard',
      }, {
        label: 'Shift',
        value: 'shift',
        reportName: 'shiftenergydashboard',
      }],
    };
  },
  created() {
    if (this.queries && this.queries.view) {
      this.setViewFromQuery(this.queries.view);
    } else if (!this.selectedView) {
      this.setView(this.views[1]);
    }
  },
  computed: {
    ...mapState('energyDashboard', ['selectedView']),
    queries() {
      return this.$route.query;
    },
    view: {
      get() {
        return this.selectedView;
      },
      set(view) {
        this.setView(view);
      },
    },
  },
  methods: {
    ...mapActions('energyDashboard', ['getBusinessTime', 'getMeters']),
    ...mapMutations('energyDashboard', ['setSelectedView', 'setLoading']),
    setViewFromQuery(value) {
      const view = this.views.find((v) => v.value === value);
      if (view) {
        this.setSelectedView(view);
      } else {
        this.setView(this.views[1]);
      }
    },
    async setView(view) {
      const query = {
        ...this.queries,
        view: view.value,
      };
      this.$router.replace({ query });
      this.setSelectedView(view);
      this.setLoading(true);
      await this.getBusinessTime();
      await this.getMeters();
      this.setLoading(false);
    },
  },
};
</script>
