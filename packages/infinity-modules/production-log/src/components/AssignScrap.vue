<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        small
        v-on="on"
        color="primary"
        class="text-none ml-4 mb-1"
      >
        <v-icon>mdi-update</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Scrap - {{ production.shift }} | {{ production.machinename }} |
        {{ production.partname }}
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="close"
          :disabled="saving"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AssignScrap',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saving: false,
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
