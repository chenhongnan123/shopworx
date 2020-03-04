<template>
  <swx-fullscreen-layout>
    <template slot="navbarItems">
      <infinity-account-menu :showProfile="false" />
    </template>
    <v-card flat class="transparent">
      <p
        class="text-center primary--text display-2 font-weight-medium"
        v-text="$t('infinity.user.register.title')"
      ></p>
      <p
        class="text-center title font-weight-regular"
        v-text="$t('infinity.user.register.subTitle')"
      ></p>
      <v-row>
        <v-col
          md="6"
          cols="12"
          class="text-center"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          <v-img
            :src="require(`@shopworx/assets/svgs/${userInfoSvg}.svg`)"
            contain
            height="330"
          >
          </v-img>
        </v-col>
        <v-col
          md="6"
          cols="12"
        >
          <register-user @success="success" />
        </v-col>
      </v-row>
    </v-card>
  </swx-fullscreen-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SwxFullscreenLayout from '@shopworx/ui-components/core/SwxFullscreenLayout.vue';
import InfinityAccountMenu from '@/components/core/navbar/InfinityAccountMenu.vue';
import RegisterUser from '@/components/user/register/RegisterUser.vue';

export default {
  name: 'Register',
  metaInfo() {
    return {
      title: 'Register',
    };
  },
  components: {
    SwxFullscreenLayout,
    InfinityAccountMenu,
    RegisterUser,
  },
  computed: {
    ...mapGetters('user', ['isRegistrationComplete']),
    userInfoSvg() {
      return this.$vuetify.theme.dark
        ? 'user-info-dark'
        : 'user-info-light';
    },
  },
  created() {
    if (this.isRegistrationComplete) {
      this.$router.replace({ name: 'home' });
    }
  },
  methods: {
    ...mapActions('user', ['activateUser']),
    async success() {
      const activated = await this.activateUser();
      if (activated) {
        this.$router.replace({ name: 'invite' });
      }
    },
  },
};
</script>
