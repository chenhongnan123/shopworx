<template>
  <v-btn small color="primary" class="text-none" @click="saveline" :disabled="btndisable"
    >Save
  </v-btn>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'SelectedLineUpdate',
  data() {
    return {
      btndisable: false,
    };
  },
  created() {
    this.selectedLineNew = { ...this.selectedLine };
  },
  computed: {
    ...mapState('productionLayoutSF', ['selectedLine', 'machinesbylines']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutSF', ['updateLine']),
    async saveline() {
      this.saving = true;
      this.selectedLineNew = { ...this.selectedLine };
      this.newSaveLine = {
        description: this.selectedLine.description,
        expectedoee: this.selectedLine.expectedoee,
        ipaddr: this.selectedLine.ipaddr,
        hostname: this.selectedLine.hostname,
        expectedcycletime: this.selectedLine.expectedcycletime,
      };
      let created = false;
      const payload = {
        query: `?query=id=="${this.selectedLine.id}"`,
        payload: this.newSaveLine,
        id: this.selectedLine.id,
      };
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
    compareValues(val) {
      if (val.description === this.selectedLineNew.description) {
        this.btndisable = true;
      } else {
        this.btndisable = false;
      }
    },
  },
  watch: {
    selectedLine: {
      handler(val) {
        this.compareValues(val);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
