<template>
  <v-navigation-drawer
    app
    right
    width="290"
    v-if="!isTV && !isFullscreen"
    v-model="drawerInput"
  >
    <v-toolbar flat>
      <v-toolbar-title>
        Configure
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleConfigDrawer">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <perfect-scrollbar style="height: calc(100% - 64px)">
      <v-card flat class="transparent">
        <v-card-text>
          <theme />
        </v-card-text>
      </v-card>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import Theme from './config/Theme.vue';

export default {
  name: 'ConfigDrawer',
  components: {
    Theme,
  },
  computed: {
    ...mapState('helper', ['configDrawer', 'isFullscreen']),
    ...mapGetters('helper', ['isTV']),
    drawerInput: {
      get() {
        return this.configDrawer;
      },
      set(val) {
        this.setConfigDrawer(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setConfigDrawer', 'toggleConfigDrawer']),
  },
};
</script>
