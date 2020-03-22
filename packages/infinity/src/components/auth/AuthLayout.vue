<template>
  <v-content>
    <auth-header />
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
          <v-img
            :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
            contain
          />
        </v-col>
        <v-col cols="12" md="6" lg="5" xl="4" class="text-justify">
          <v-card flat class="transparent">
            <div class="display-1 mb-4 font-weight-medium text-center primary--text">
              {{ title }}
            </div>
            <div class="headline text-center">
              {{ subTitle }}
            </div>
            <slot />
            <v-card-actions class="py-0">
              <v-row no-gutters>
                <v-col cols="4" xl="3">
                  <v-select
                    flat
                    solo
                    dense
                    :items="locales"
                    menu-props="top"
                    item-text="text"
                    item-value="value"
                    v-model="currentLocale"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import LocaleService from '@shopworx/services/util/locale.service';
import AuthHeader from '@/components/auth/AuthHeader.vue';

export default {
  name: 'AuthLayout',
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    illustration: {
      type: String,
      required: true,
    },
  },
  components: {
    AuthHeader,
  },
  data() {
    return {
      locales: [
        {
          text: 'English',
          value: 'en',
        },
        {
          text: 'हिन्दी',
          value: 'hi',
        },
        {
          text: '中文',
          value: 'zhHans',
        },
        {
          text: 'ไทย',
          value: 'th',
        },
        {
          text: 'Deutsche',
          value: 'de',
        },
      ],
    };
  },
  computed: {
    currentLocale: {
      get() {
        return this.$i18n.locale;
      },
      set(val) {
        this.$i18n.locale = val;
        LocaleService.setLocale(val);
      },
    },
  },
};
</script>
