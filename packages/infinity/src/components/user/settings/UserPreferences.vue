<template>
  <v-card class="transparent" flat>
    <user-avatar />
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
      <v-switch
        v-model="darkMode"
        :label="$t('user.preferences.darkMode')"
      ></v-switch>
    </v-card-text>
    <v-card-title class="px-0 py-0 pt-2">
      {{ $t('user.preferences.avatar') }}
    </v-card-title>
    <v-card-text class="py-0">
      <v-radio-group row v-model="selectedAvatar">
        <v-radio
          v-for="avatar in avatars"
          :key="avatar"
          :value="avatar"
        >
          <template #label>
            <avatar
              :name="fullName"
              :variant="avatar"
              :size="36"
            />
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import LocaleService from '@shopworx/services/util/locale.service';
import UserAvatar from '@/components/user/settings/UserAvatar.vue';
import Avatar from '@shopworx/ui-components/avatars/Avatar.vue';

export default {
  name: 'UserPreferences',
  components: {
    UserAvatar,
    Avatar,
  },
  data() {
    return {
      password: '',
      loading: false,
      confirmPassword: '',
    };
  },
  computed: {
    ...mapState('helper', [
      'locales',
      'avatars',
      'isDark',
      'currentLocale',
      'currentAvatar',
    ]),
    ...mapGetters('user', [
      'fullName',
    ]),
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
    selectedAvatar: {
      get() {
        return this.currentAvatar;
      },
      set(val) {
        this.setCurrentAvatar(val);
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
    ...mapMutations('helper', [
      'toggleIsDark',
      'setCurrentLocale',
      'setCurrentAvatar',
    ]),
  },
};
</script>
