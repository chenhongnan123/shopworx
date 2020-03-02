<template>
  <v-card flat>
    <p
      class="text-center primary--text display-1 font-weight-medium my-2"
      v-text="$t('infinity.planning.onboarding.welcome.title')"
    ></p>
    <v-card-text>
      <v-img
        :src="require(`@shopworx/assets/svgs/${planningSvg}.svg`)"
        contain
        height="230"
      ></v-img>
      <v-row>
        <v-col cols="12">
          <span
            class="title font-weight-medium"
            v-text="$t('infinity.user.welcome.details.featureOne.title')"
          ></span>
          <p
            class="body-1"
            v-text="$t('infinity.user.welcome.details.featureOne.description')"
          ></p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PlanningWelcome',
  computed: {
    planningSvg() {
      return this.$vuetify.theme.dark
        ? 'planning-dark'
        : 'planning-light';
    },
  },
};
</script>
