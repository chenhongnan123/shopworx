<template>
  <v-card class="transparent mt-10" flat>
    <v-card-title class="px-0 py-0 pt-2">
      {{ $t('user.preferences.language') }}
    </v-card-title>
    <v-card-text class="py-0 pt-2">
      <v-select
        filled
        id="locale"
        :items="locales"
        item-text="text"
        item-value="value"
        autocomplete="language"
        v-model="locale"
        prepend-icon="$locale"
        :label="$t('user.preferences.language')"
      ></v-select>
    </v-card-text>
    <v-card-title class="px-0 py-0 pt-2">
      {{ $t('user.preferences.display') }}
    </v-card-title>
    <v-card-text class="py-0">
      <v-switch v-model="darkMode" :label="$t('user.preferences.darkMode')"></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import LocaleService from '@shopworx/services/util/locale.service';

export default {
  name: 'UserPreferences',
  components: {},
  data() {
    return {
      password: '',
      loading: false,
      confirmPassword: '',
    };
  },
  computed: {
    ...mapState('helper', ['locales', 'isDark', 'currentLocale']),
    locale: {
      get() {
        this.setCurrentLocale(this.$i18n.locale);
        return this.currentLocale;
      },
      set(val) {
        this.$i18n.locale = val;
        LocaleService.setLocale(val);
        this.setCurrentLocale(val);
      },
    },
    darkMode: {
      get() {
        return this.isDark;
      },
      set() {
        this.toggleIsDark();
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['toggleIsDark', 'setCurrentLocale']),
  },
};
</script>
