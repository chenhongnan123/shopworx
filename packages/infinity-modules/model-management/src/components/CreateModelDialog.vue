<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-none ml-5"
      >
        <v-icon left small>mdi-plus</v-icon>
        Create new model
      </v-btn>
    </template>
    <v-card>
      Create dialog
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateModelDialog',
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
