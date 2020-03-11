<template>
  <v-card flat class="transparent">
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-row no-gutters>
        <v-col md="3" xl="2">
          <master-list />
        </v-col>
        <v-col md="9" xl="10">
          <master-window class="ml-2" />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row no-gutters>
        <v-col cols="12">
          <master-list v-if="showList" />
        </v-col>
        <v-col cols="12" v-if="showDetails">
          <master-window />
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MasterList from '../components/MasterList.vue';
import MasterWindow from '../components/MasterWindow.vue';

export default {
  name: 'Masters',
  components: {
    MasterList,
    MasterWindow,
  },
  computed: {
    ...mapState('user', ['me']),
    showList() {
      return this.$route.params.id === undefined;
    },
    showDetails() {
      return this.$route.params.id !== undefined;
    },
  },
  async created() {
    if (this.me) {
      await this.getElements();
    } else {
      const user = await this.getMe();
      if (user) {
        await this.getElements();
      }
    }
  },
  methods: {
    ...mapActions('masters', ['getElements']),
    ...mapActions('user', ['getMe']),
  },
};
</script>
