<template>
  <div>
    <swx-sidebar
      :icon="sidebarIcon"
      :showSidebar="sidebar"
      :items="sidebarItems"
      :adminItems="sidebarAdminItems"
      @set-sidebar="setSidebar"
    />
    <swx-navbar @toggle-sidebar="toggleSidebar">
      <template slot="navbar">
        <slot name="navbar" />
      </template>
      <slot name="navbarItems" />
    </swx-navbar>
    <slot name="root" />
    <v-content :class="$vuetify.theme.dark ? '#121212' : 'grey lighten-5'">
      <perfect-scrollbar :options="{ suppressScrollX: true }">
        <v-container
          fluid
          :style="$vuetify.breakpoint.mdAndUp
            ? 'height: calc(100vh - 64px)'
            : 'height: calc(100vh - 56px)'"
        >
          <slot />
        </v-container>
      </perfect-scrollbar>
    </v-content>
  </div>
</template>

<script>
import SwxNavbar from './SwxNavbar.vue';
import SwxSidebar from './SwxSidebar.vue';

export default {
  name: 'DashboardLayout',
  components: {
    SwxNavbar,
    SwxSidebar,
  },
  props: {
    sidebarIcon: {
      type: String,
      required: true,
    },
    sidebarItems: {
      type: Array,
      required: true,
    },
    sidebarAdminItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sidebar: true,
    };
  },
  methods: {
    setSidebar(val) {
      this.sidebar = val;
    },
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },
  },
};
</script>
