<template>
  <v-combobox
    dense
    outlined
    label="Type"
    v-model="type"
    return-object
    item-text="name"
    :items="downtimeTypeList"
    prepend-inner-icon="mdi-text-box-multiple-outline"
  ></v-combobox>
</template>

<script>
import {
  mapMutations,
  mapState,
} from 'vuex';

export default {
  name: 'TypeSelection',
  data() {
    return {
      downtimeTypeList: [{
        name: 'All',
        value: 0,
      }, {
        name: 'With reason',
        value: 'reason',
      }, {
        name: 'Without reason',
        value: 'noreason',
      }],
    };
  },
  computed: {
    ...mapState('downtimeLog', ['selectedType']),
    type: {
      get() {
        return this.selectedType;
      },
      set(val) {
        this.setSelectedType(val);
      },
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedType']),
  },
  created() {
    if (!this.selectedType) {
      this.setSelectedType(this.downtimeTypeList[0]);
    }
  },
};
</script>
