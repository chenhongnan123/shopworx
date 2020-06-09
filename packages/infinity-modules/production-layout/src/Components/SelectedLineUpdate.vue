<template>
  <v-btn
  color="primary"
  @click="saveline"
  >Save
  </v-btn>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'SelectedLineUpdate',
  props: {
    lineid: {
      type: Object,
      required: true,
    },
  },
  created() {
    console.log(this.lineid);
    this.selectedLine = { ...this.lineid };
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['updateLine']),
    async saveline() {
      this.saving = true;
      this.newSaveLine = {
        name: this.selectedLine.name,
        description: this.selectedLine.description,
        expectedoee: this.selectedLine.expectedoee,
        expectedcycletime: this.selectedLine.expectedcycletime,
      };
      let created = false;
      const payload = {
        query: `?query=id=="${this.selectedLine.id}"`,
        payload: this.newSaveLine,
        id: this.selectedLine.id,
      };
      console.log(payload);
      created = this.updateLine(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'LINE_UPDATED',
        });
        this.dialog = false;
        this.assetId = 4;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_Line',
        });
      }
      this.saving = false;
    },
    async resetDialog() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style>
</style>
