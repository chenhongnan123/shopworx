<template>
  <swx-fullscreen-layout>
    <template slot="navbarItems">
      <infinity-account-menu :showProfile="false" />
    </template>
    <v-card flat class="transparent">
      <p
        class="text-center primary--text display-2 font-weight-medium"
        v-text="$t('infinity.user.invite.title')"
      ></p>
      <p
        class="text-center title font-weight-regular"
        v-text="$t('infinity.user.invite.subTitle')"
      ></p>
      <v-row>
        <v-col
          md="5"
          cols="12"
          class="text-center"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          <v-img
            :src="require(`@shopworx/assets/svgs/${inviteSvg}.svg`)"
            contain
            height="330"
          >
          </v-img>
        </v-col>
        <v-col
          md="7"
          cols="12"
        >
          <invite-users @success="success" />
        </v-col>
      </v-row>
    </v-card>
  </swx-fullscreen-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import SwxFullscreenLayout from '@shopworx/ui-components/core/SwxFullscreenLayout.vue';
import InfinityAccountMenu from '@/components/core/navbar/InfinityAccountMenu.vue';
import InviteUsers from '@/components/user/InviteUsers.vue';

export default {
  name: 'Invite',
  metaInfo() {
    return {
      title: 'Invite users',
    };
  },
  components: {
    SwxFullscreenLayout,
    InfinityAccountMenu,
    InviteUsers,
  },
  computed: {
    ...mapGetters('user', ['isAdmin']),
    inviteSvg() {
      return this.$vuetify.theme.dark
        ? 'user-invite-dark'
        : 'user-invite-light';
    },
  },
  async created() {
    if (!this.isAdmin) {
      this.$router.push({ name: 'onboarding' });
    }
  },
  methods: {
    success() {
      this.$router.push({ name: 'onboarding' });
    },
  },
};
</script>
