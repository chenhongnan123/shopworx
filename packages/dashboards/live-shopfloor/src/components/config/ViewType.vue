<template>
  <div>
    <div>
      VIEW
    </div>
    <v-radio-group
      dense
      hide-details
      class="ma-0 pa-0"
      v-model="currentView"
    >
      <v-radio
        v-for="(view, n) in views"
        :key="n"
        :label="$t(`shopfloorDashboard.${view}`)"
        :value="view"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ViewType',
  computed: {
    ...mapState('shopfloor', ['selectedView', 'views']),
    queries() {
      return this.$route.query;
    },
    currentView: {
      get() {
        return this.selectedView;
      },
      set(view) {
        this.setView(view);
      },
    },
  },
  methods: {
    ...mapMutations('shopfloor', ['setSelectedView']),
    async setView(view) {
      const query = {
        ...this.queries,
        view,
      };
      this.$router.replace({ query }).catch(() => {});
      this.setSelectedView(view);
    },
  },
};
</script>
