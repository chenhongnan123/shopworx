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
      {{ model }}
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ModelDetailsDialog',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
    };
  },
  methods: {
    ...mapActions('modelManagement', ['fetchModelDetails']),
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.loading = true;
        // eslint-disable-next-line
        await this.fetchModelDetails(this.model._id);
        this.loading = false;
      }
    },
  },
};
</script>
