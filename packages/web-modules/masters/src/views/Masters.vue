<template>
  <v-card flat class="transparent">
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-row>
        <v-col md="3" xl="2">
          <master-list />
        </v-col>
        <v-col md="9" xl="10">
          {{ this.$route.params.id }}
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col cols="12">
          <master-list v-if="showList" />
        </v-col>
        <v-col cols="12" v-if="showDetails">
          {{ this.$route.params.id }}
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import MasterList from '../components/MasterList.vue';

export default {
  name: 'Masters',
  components: {
    MasterList,
  },
  computed: {
    showList() {
      return this.$route.params.id === undefined;
    },
    showDetails() {
      return this.$route.params.id !== undefined;
    },
  },
  async created() {
    await this.getElements();
  },
  methods: {
    ...mapActions('masters', ['getElements']),
  },
};
</script>
