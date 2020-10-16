<template>
   <v-switch
        v-model="multipleSelection"
        :label="this.multipleSelection ?
         'Disable Multiple Assignment' : 'Enable Multiple Assignment'"
    ></v-switch>
</template>

<script>
import {
  mapMutations,
  mapState,
} from 'vuex';

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
    ...mapMutations('downtimeLog', [
      'setToggleSelection',
    ]),
  },
};
</script>

<style>

</style>
