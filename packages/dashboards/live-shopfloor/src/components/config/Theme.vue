<template>
  <div>
    <div>
      THEME
    </div>
    <v-radio-group
      dense
      hide-details
      class="ma-0 pa-0"
      v-model="currentTheme"
    >
      <v-radio
        v-for="(theme, n) in themes"
        :key="n"
        :label="$t(`shopfloorDashboard.${theme}`)"
        :value="theme"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Theme',
  computed: {
    ...mapState('shopfloor', ['selectedTheme', 'themes']),
    queries() {
      return this.$route.query;
    },
    currentTheme: {
      get() {
        return this.selectedTheme;
      },
      set(theme) {
        this.setTheme(theme);
      },
    },
  },
  methods: {
    ...mapMutations('shopfloor', ['setSelectedTheme']),
    setTheme(theme) {
      const query = {
        ...this.queries,
        theme,
      };
      this.$router.replace({ query }).catch(() => {});
      this.setSelectedTheme(theme);
    },
  },
};
</script>
