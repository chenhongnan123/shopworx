<template>
  <v-card class="transparent" flat>
    <user-avatar />
    <v-card-text class="py-0">
      <v-select
        id="locale"
        :items="locales"
        item-text="text"
        item-value="value"
        autocomplete="language"
        v-model="currentLocale"
        prepend-inner-icon="$locale"
        :label="$t('user.preferences.language')"
      ></v-select>
    </v-card-text>
    <v-card-title class="px-0">
      {{ $t('user.preferences.display') }}
    </v-card-title>
    <v-card-text class="py-0">
      <v-switch
        v-model="darkMode"
        :label="$t('user.preferences.darkMode')"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import LocaleService from '@shopworx/services/util/locale.service';
import UserAvatar from '@/components/user/settings/UserAvatar.vue';

export default {
  name: 'UserPreferences',
  components: {
    UserAvatar,
  },
  data() {
    return {
      password: '',
      loading: false,
      confirmPassword: '',
    };
  },
  computed: {
    ...mapState('helper', ['locales', 'isDark']),
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
      set(val) {
        this.$i18n.locale = val;
        LocaleService.setLocale(val);
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
    ...mapMutations('helper', ['toggleIsDark']),
  },
};
</script>
