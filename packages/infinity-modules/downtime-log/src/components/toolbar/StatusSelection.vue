<template>
  <v-combobox
    dense
    outlined
    return-object
    item-text="name"
    v-model="status"
    :items="statusList"
    label="Status"
    prepend-inner-icon="mdi-progress-check"
  ></v-combobox>
</template>

<script>
import {
  mapMutations,
  mapState,
} from 'vuex';

export default {
  name: 'StatusSelection',
  data() {
    return {
      statusList: [{
        name: 'All',
        value: null,
      }, {
        name: 'Ongoing',
        value: 'status=="inProgress"',
      }, {
        name: 'Completed',
        value: 'status!="inProgress"',
      }],
    };
  },
  computed: {
    ...mapState('downtimeLog', ['selectedStatus']),
    status: {
      get() {
        return this.selectedStatus;
      },
      set(val) {
        this.setSelectedStatus(val);
      },
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedStatus']),
  },
  created() {
    if (!this.selectedStatus) {
      this.setSelectedStatus(this.statusList[0]);
    }
  },
};
</script>
