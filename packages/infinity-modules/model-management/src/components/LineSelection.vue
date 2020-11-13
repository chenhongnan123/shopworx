<template>
  <v-autocomplete
    dense
    outlined
    hide-details
    v-model="line"
    :items="lines"
    item-value="id"
    item-text="name"
    :loading="loading"
    label="Select line"
    :disabled="fetchingLineDetails"
    style="float: left; width: 40%;"
  ></v-autocomplete>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'LineSelection',
  data() {
    return {
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    if (this.lines && this.lines.length) {
      if (!this.selectedLine) {
        this.setSelectedLine(this.lines[0].id);
      }
    } else {
      await this.getLines();
    }
    this.loading = false;
  },
  computed: {
    ...mapState('modelManagement', [
      'lines',
      'selectedLine',
      'fetchingLineDetails',
    ]),
    line: {
      get() {
        return this.selectedLine;
      },
      set(val) {
        this.setSelectedLine(val);
      },
    },
  },
  methods: {
    ...mapActions('modelManagement', ['getLines']),
    ...mapMutations('modelManagement', ['setSelectedLine']),
  },
  watch: {
    lines(val) {
      if (val && val.length) {
        if (!this.selectedLine) {
          this.setSelectedLine(val[0].id);
        }
      }
    },
  },
};
</script>
