<template>
  <v-select
    dense
    outlined
    return-object
    item-text="name"
    v-model="model"
    :items="groupList"
    label="Group by"
    prepend-inner-icon="mdi-select-group"
  ></v-select>
</template>

<script>
import {
  mapMutations,
  mapGetters,
} from 'vuex';

export default {
  name: 'GroupSelection',
  data() {
    return {
      groupList: [{
        name: 'Machine',
        value: 'machinename',
      }, {
        name: 'Part',
        value: 'partname',
      }, {
        name: 'Status',
        value: 'status',
      }],
    };
  },
  computed: {
    ...mapGetters('webApp', ['group']),
    isGroupInactive() {
      return this.group.length === 0;
    },
    model: {
      get() {
        if (!this.isGroupInactive) {
          const value = this.groupList.find((s) => this.group.includes(s.value));
          if (value) {
            return value;
          }
        }
        return this.groupList[0];
      },
      set(groupVal) {
        this.setGroupVal(groupVal);
      },
    },
  },
  created() {
    if (this.isGroupInactive) {
      this.setGroupVal(this.groupList[0]);
    }
  },
  methods: {
    ...mapMutations('webApp', ['setGroup']),
    setGroupVal(group) {
      this.setGroup([group.value]);
    },
  },
};
</script>
