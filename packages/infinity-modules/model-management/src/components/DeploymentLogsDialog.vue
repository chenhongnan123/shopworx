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
        View logs
      </a>
    </template>
    <v-card>
      Logs dialog
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeploymentLogsDialog',
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
