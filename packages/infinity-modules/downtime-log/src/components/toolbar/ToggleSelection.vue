<template>
   <v-switch
        v-model="multipleSelection"
        @change="onValuechange"
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
  data() {
    return {
      multipleSelection: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', ['toggleSelection']),
  },
  methods: {
    ...mapMutations('downtimeLog', [
      'setToggleSelection',
    ]),
    async onValuechange() {
      this.setToggleSelection(this.multipleSelection);
    },
  },
};
</script>

<style>

</style>
