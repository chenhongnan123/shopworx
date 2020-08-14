<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        small
        v-on="on"
        outlined
        color="primary"
        class="text-none"
      >
        <v-icon left>mdi-call-split</v-icon>
        Split
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Split downtime
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" class="text-none">
          Reset
        </v-btn>
        <v-btn color="primary" class="text-none">
          Split
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DowntimeSplit',
  data() {
    return {
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
