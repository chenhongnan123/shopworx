<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="error"
        :small="small"
        :class="spaceClass"
        :loading="deleting"
        @click="removeModel"
      >
        <v-icon v-text="'$delete'"></v-icon>
      </v-btn>
    </template>
    <span>Delete model</span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DeleteModel',
  props: {
    model: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    spaceClass: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      deleting: false,
    };
  },
  methods: {
    ...mapActions('modelManagement', ['deleteModel', 'fetchModelDetails']),
    async removeModel() {
      if (await this.$root.$confirm.open(
        'Delete model',
        `Are you sure want to delete "${this.model.name}"?
        This will also delete the associated model configurations.`,
      )) {
        this.deleting = true;
        await this.fetchModelDetails(this.model.id);
        await this.deleteModel(this.model.id);
        if (this.$route.name === 'modelDetails') {
          this.$router.push({ name: 'modelManagement' });
        }
        this.deleting = false;
      }
    },
  },
};
</script>
