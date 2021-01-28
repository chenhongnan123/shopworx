<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-row no-gutters>
        <v-col cols="6" class="my-auto text-center">
          <v-icon
            x-large
            v-text="icon.name"
            :color="icon.color"
          ></v-icon>
        </v-col>
        <v-col
          cols="6"
          :class="`text-right ${icon.color} pr-2`"
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
    <v-divider v-if="action !== null"></v-divider>
    <v-card-actions class="pa-0">
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        class="text-none"
        v-if="action !== null"
        @click="$router.push(action.route)"
      >
        <span v-text="action.text"></span>
        <v-icon right>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'StatsWidget',
  props: {
    icon: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    stat: {
      type: [String, Number],
      default: null,
    },
    action: {
      type: Object,
      default: null,
    },
  },
};
</script>
