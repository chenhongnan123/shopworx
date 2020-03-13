<template>
  <v-card flat class="transparent">
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-row no-gutters>
        <v-col md="3" xl="2">
          <admin-list />
        </v-col>
        <v-col md="9" xl="10">
          <admin-window class="ml-2" />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row no-gutters>
        <v-col cols="12">
          <admin-list v-if="showList" />
        </v-col>
        <v-col cols="12" v-if="showDetails">
          <admin-window />
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script>
import AdminList from '../components/AdminList.vue';
import AdminWindow from '../components/AdminWindow.vue';

export default {
  name: 'Admin',
  components: {
    AdminList,
    AdminWindow,
  },
  computed: {
    showList() {
      return this.$route.params.id === undefined;
    },
    showDetails() {
      return this.$route.params.id !== undefined;
    },
  },
};
</script>
