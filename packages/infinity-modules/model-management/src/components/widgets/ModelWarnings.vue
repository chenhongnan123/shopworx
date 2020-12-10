<template>
  <v-responsive :min-height="220">
    <v-card
      flat
      rounded="lg"
      style="height:100%"
    >
      <v-card-title primary-title>
        Alerts
      </v-card-title>
      <v-card-text>
        <div
          v-for="(warning, n) in warnings"
          :key="n"
          class="title fonw-weight-regular error--text"
        >
          {{ warning }}
        </div>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
export default {
  name: 'ModelWarnings',
  data() {
    return {
      warnings: [
        'No Trigger Found',
        'Short Cycle Found',
        'Long Cycle Found',
        'Other problems with segmentation',
      ],
    };
  },
};
</script>
