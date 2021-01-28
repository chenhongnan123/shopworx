<template>
  <v-row no-gutters>
    <v-col cols="2">
      <v-btn
        icon
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="8">
      <v-item-group
        v-model="currentItem"
        class="text-center"
        mandatory
        v-if="$vuetify.breakpoint.mdAndUp"
      >
        <v-item
          v-for="n in len"
          :key="`btn-${n}`"
          #default="{ active }"
        >
          <v-btn
            :input-value="active"
            icon
            @click="toggle(n)"
          >
            <v-icon small>mdi-record</v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
    </v-col>
    <v-col cols="2" class="text-right">
      <v-btn
        icon
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'MachinePaginator',
  computed: {
    ...mapState('machineDashboard', ['page']),
    currentItem: {
      get() {
        return this.page;
      },
      set(val) {
        this.setPage(val);
      },
    },
  },
  props: {
    len: {
      type: Number,
    },
  },
  methods: {
    ...mapMutations('machineDashboard', ['setPage']),
    next() {
      if (this.page + 1 === this.len) {
        this.setPage(0);
      } else {
        this.setPage(this.page + 1);
      }
    },
    prev() {
      if (this.page - 1 < 0) {
        this.setPage(this.len - 1);
      } else {
        this.setPage(this.page - 1);
      }
    },
    toggle(val) {
      this.setPage(val - 1);
    },
  },
};
</script>
