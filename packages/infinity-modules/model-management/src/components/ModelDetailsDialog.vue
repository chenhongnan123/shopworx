<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <a
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-decoration-underline"
      >
        View details
      </a>
    </template>
    <v-card>
      Details dialog (input, files and output)
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModelDetailsDialog',
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
