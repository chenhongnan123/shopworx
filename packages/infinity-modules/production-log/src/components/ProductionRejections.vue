<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        small
        v-on="on"
        color="primary"
        class="text-none"
      >
        <v-icon left>mdi-plus</v-icon>
        Rejections
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Add new rejection
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="close"
          :disabled="loading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ProductionSplit',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
    };
  },
  methods: {
    close() {
      this.dialog = false;
    },
  },
};
</script>
