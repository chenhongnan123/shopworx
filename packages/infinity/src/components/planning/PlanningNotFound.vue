<template>
  <v-card flat class="transparent" style="height:100%">
    <v-card-text class="text-center" style="height: 80%">
      <v-row align="center" no-gutters style="height: 100%">
        <v-col>
          <div>
            <v-icon
              size="96"
              v-text="'$planning'"
            ></v-icon>
          </div>
          <div
            class="title font-weight-regular"
            v-text="$t('infinity.planning.notFound.title')"
          ></div>
          <v-btn
            class="text-none primary mt-2"
            :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
            v-text="$t('infinity.planning.notFound.subTitle')"
          ></v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PlanningNotFound',
};
</script>
