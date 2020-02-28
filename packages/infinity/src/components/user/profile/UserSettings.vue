<template>
  <v-card flat>
    <v-card-text>
      <v-subheader
        class="px-0 px-2 text-uppercase"
        v-text="$t('infinity.userProfile.settings.title')"
      ></v-subheader>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            outlined
            :items="locales"
            item-text="text"
            item-value="key"
            v-model="currentLocale"
            :label="$t('infinity.userProfile.settings.locale.label')"
          >
            <template #item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
                <v-list-item-subtitle
                  v-text="$t(`infinity.userProfile.settings.locale.items.${item.subText}`)"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import LocaleService from '@shopworx/services/util/locale.service';

export default {
  name: 'UserSettings',
  data() {
    return {
      locales: [
        {
          key: 'en',
          text: 'English (en)',
          subText: 'english',
        },
        {
          key: 'hi',
          text: 'Hindi (hi)',
          subText: 'hindi',
        },
        {
          key: 'zhHans',
          text: 'Chinese (zhHans)',
          subText: 'simplifiedChinese',
        },
        /* {
          key: 'th',
          text: 'Thai (th)',
          subText: 'thai',
        }, */
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
