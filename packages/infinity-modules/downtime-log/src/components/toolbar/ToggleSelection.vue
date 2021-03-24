<template>
  <v-switch
    v-model="multipleSelection"
    class="ma-0"
    v-if="$vuetify.breakpoint.smAndUp"
    :label="
      this.multipleSelection
        ? 'Disable multiple assignment'
        : 'Enable multiple assignment'
    "
  ></v-switch>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'ToggleSelection',
  computed: {
    ...mapState('downtimeLog', ['toggleSelection']),
    multipleSelection: {
      get() {
        return this.toggleSelection;
      },
      set(val) {
        this.setToggleSelection(val);
      },
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['setToggleSelection']),
  },
};
</script>
