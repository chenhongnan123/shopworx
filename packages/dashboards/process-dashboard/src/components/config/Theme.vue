<template>
  <div>
    <div>
      THEME
    </div>
    <v-radio-group
      dense
      hide-details
      class="ma-0 pa-0"
      v-model="theme"
    >
      <v-radio
        v-for="(theme, n) in themes"
        :key="n"
        :label="theme.label"
        :value="theme"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ViewType',
  data() {
    return {
      themes: [{
        label: 'Light',
        value: 'light',
      }, {
        label: 'Dark',
        value: 'dark',
      }],
    };
  },
  created() {
    if (this.queries && this.queries.theme) {
      this.setThemeFromQuery(this.queries.theme);
    } else if (!this.selectedTheme) {
      this.setTheme(this.themes[0]);
    }
  },
  computed: {
    ...mapState('processDashboard', ['selectedTheme']),
    queries() {
      return this.$route.query;
    },
    theme: {
      get() {
        return this.selectedTheme;
      },
      set(theme) {
        this.setTheme(theme);
      },
    },
  },
  methods: {
    ...mapMutations('processDashboard', ['setSelectedTheme']),
    setThemeFromQuery(value) {
      const theme = this.themes.find((v) => v.value === value);
      if (theme) {
        this.setSelectedTheme(theme);
      } else {
        this.setTheme(this.themes[0]);
      }
    },
    setTheme(theme) {
      const query = {
        ...this.queries,
        theme: theme.value,
      };
      this.$vuetify.theme.dark = theme.value === 'dark';
      this.$router.replace({ query });
      this.setSelectedTheme(theme);
    },
  },
};
</script>
