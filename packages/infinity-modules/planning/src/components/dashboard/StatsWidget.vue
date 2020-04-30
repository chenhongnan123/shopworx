<template>
  <v-card outlined>
    <v-card-text class="pa-0">
      <v-row no-gutters>
        <v-col cols="6" class="my-auto text-center">
          <v-icon
            x-large
            v-text="icon"
            :color="color"
          ></v-icon>
        </v-col>
        <v-col
          cols="6"
          :class="`text-right ${color} pr-2`"
        >
          <div
            class="title font-weight-medium"
            v-text="title"
          ></div>
          <div
            class="headline font-weight-medium"
            v-text="stat"
          ></div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'StatsWidget',
  props: {
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: 'primary',
    },
    title: {
      type: String,
      default: null,
    },
    stat: {
      type: [String, Number],
      default: null,
    },
  },
};
</script>
