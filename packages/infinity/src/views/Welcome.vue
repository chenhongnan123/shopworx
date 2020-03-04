<template>
  <swx-fullscreen-layout>
    <template slot="navbarItems">
      <infinity-account-menu :showProfile="false" />
    </template>
    <v-card flat class="transparent">
      <p
        class="text-center primary--text display-2 font-weight-medium"
        v-text="$t('infinity.user.welcome.title')"
      ></p>
      <p
        class="text-center title font-weight-regular"
        v-text="$t('infinity.user.welcome.subTitle')"
      ></p>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn
            color="primary"
            class="text-none"
            @click="start"
            :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          >
            {{ $t('infinity.user.welcome.buttons.startSetup') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-card-text>
        <v-row>
          <v-col
            md="6"
            cols="12"
            order="2"
            order-md="1"
          >
            <v-row>
              <v-col cols="12">
                <span
                  class="headline font-weight-medium"
                  v-text="$t('infinity.user.welcome.details.featureOne.title')"
                ></span>
                <p
                  class="body-1"
                  v-text="$t('infinity.user.welcome.details.featureOne.description')"
                ></p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <span
                  class="headline font-weight-medium"
                  v-text="$t('infinity.user.welcome.details.featureTwo.title')"
                ></span>
                <p
                  class="body-1"
                  v-text="$t('infinity.user.welcome.details.featureTwo.description')"
                ></p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <span
                  class="headline font-weight-medium"
                  v-text="$t('infinity.user.welcome.details.featureThree.title')"
                ></span>
                <p
                  class="body-1"
                  v-text="$t('infinity.user.welcome.details.featureThree.description')"
                ></p>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            md="6"
            cols="12"
            order="1"
            order-md="2"
            class="text-center"
          >
            <v-img
              :src="require(`@shopworx/assets/svgs/${dataSvg}.svg`)"
              contain
              height="330"
            ></v-img>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </swx-fullscreen-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import SwxFullscreenLayout from '@shopworx/ui-components/core/SwxFullscreenLayout.vue';
import InfinityAccountMenu from '@/components/core/navbar/InfinityAccountMenu.vue';

export default {
  name: 'Welcome',
  metaInfo() {
    return {
      title: 'Welcome',
    };
  },
  created() {
    if (this.isRegistrationComplete) {
      this.$router.replace({ name: 'home' });
    }
  },
  components: {
    SwxFullscreenLayout,
    InfinityAccountMenu,
  },
  computed: {
    ...mapGetters('user', ['isRegistrationComplete']),
    dataSvg() {
      return this.$vuetify.theme.dark
        ? 'data-dark'
        : 'data-light';
    },
  },
  methods: {
    start() {
      this.$router.replace({ name: 'register' });
    },
  },
};
</script>
