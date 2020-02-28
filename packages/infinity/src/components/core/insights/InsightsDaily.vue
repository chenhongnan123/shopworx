<template>
  <v-card flat class="transparent">
    <v-card-text class="text-center" style="height: 280px">
      <v-row align="center" no-gutters style="height: 100%">
        <v-col>
          <div
            class="title font-weight-regular"
            v-text="$t('infinity.insights.list.notFound.title')"
          ></div>
          <div
            class="subheading"
            v-text="$t('infinity.insights.list.notFound.subTitle')"
          ></div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'InsightsDaily',
};
</script>
