<template>
  <v-card flat>
    <v-card-title primary-title>
      {{ downtime.planid }}
      <v-spacer></v-spacer>
      {{ new Date(downtime.downtimestart).toLocaleTimeString('en-US') }}
      to
      {{ new Date(downtime.downtimeend).toLocaleTimeString('en-US') }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'DowntimeListItem',
  props: {
    downtime: {
      type: Object,
      required: true,
    },
  },
  computed: {},
};
</script>
