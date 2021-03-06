<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="success"
        :small="small"
        :class="spaceClass"
        :loading="deleting"
        @click="removeModel"
        :disabled="!isAdmin"
      >
        <v-icon v-text="'$test'"></v-icon>
      </v-btn>
    </template>
    <span>Test model</span>
  </v-tooltip>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

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
  computed: {
    ...mapGetters('user', ['isAdmin']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement', ['deleteModel', 'fetchModelDetails']),
    async removeModel() {
      if (this.isAdmin) {
        if (await this.$root.$confirm.open(
          'Delete model',
          `Are you sure want to delete "${this.model.name}"?
          This will also delete the associated model configurations.`,
        )) {
          this.deleting = true;
          await this.fetchModelDetails(this.model.model_id);
          await this.deleteModel({
            modelId: this.model.model_id,
            id: this.model.id,
          });
          if (this.$route.name === 'modelDetails') {
            this.$router.push({ name: 'modelManagement' });
          }
          this.deleting = false;
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ONLY_ADMIN_OPERATION',
        });
      }
    },
  },
};
</script>
