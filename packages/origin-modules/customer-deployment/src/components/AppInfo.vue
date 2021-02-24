<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="700px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"></slot>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Deployment manager info
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        HELP text + graphics
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AppInfo',
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
