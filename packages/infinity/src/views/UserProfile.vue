<template>
  <v-card flat>
    <v-avatar
      size="84"
      color="secondary"
    >
      <v-icon
        x-large
        v-text="'$account'"
        :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
      ></v-icon>
    </v-avatar>
    <span
      class="display-1 ml-2"
      v-text="fullName"
    ></span>
    <v-card-text>
      <v-tabs v-model="tab">
        <v-tab
          class="text-none"
          v-text="$t('infinity.userProfile.tabs.profile')"
        ></v-tab>
        <v-tab
          disabled
          class="text-none"
          v-text="$t('infinity.userProfile.tabs.activity')"
        ></v-tab>
        <v-tab
          class="text-none"
          v-text="$t('infinity.userProfile.tabs.settings')"
        ></v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-row>
            <v-col cols="12" md="7">
              <edit-user-profile />
            </v-col>
            <v-divider vertical class="mx-auto"></v-divider>
            <v-col cols="12" md="4">
              <edit-user-password />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <user-activity />
        </v-tab-item>
        <v-tab-item>
          <user-settings />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import EditUserProfile from '@/components/user/profile/EditUserProfile.vue';
import EditUserPassword from '@/components/user/profile/EditUserPassword.vue';
import UserActivity from '@/components/user/profile/UserActivity.vue';
import UserSettings from '@/components/user/profile/UserSettings.vue';

export default {
  name: 'UserProfile',
  metaInfo() {
    return {
      title: 'User profile',
    };
  },
  components: {
    EditUserProfile,
    EditUserPassword,
    UserActivity,
    UserSettings,
  },
  data() {
    return {
      tab: null,
    };
  },
  computed: {
    ...mapGetters('user', ['fullName']),
  },
};
</script>
