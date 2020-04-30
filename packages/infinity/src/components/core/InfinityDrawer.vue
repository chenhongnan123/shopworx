<template>
  <v-navigation-drawer
    app
    dark
    floating
    color="#212121"
    v-model="drawer"
    :expand-on-hover="expandOnHover && $vuetify.breakpoint.lgAndUp"
  >
    <v-list
      shaped
      class="py-1"
    >
      <v-list-item>
        <v-list-item-icon>
          <v-icon
            :color="$vuetify.theme.dark ? 'primary': 'secondary'"
            v-text="'$infinity'"
          ></v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <img
            :src="require(`@shopworx/assets/logo/${logoName}.png`)"
            contain
            class="mb-2"
            height="38"
          />
        </v-list-item-title>
        <v-list-item-action v-if="$vuetify.breakpoint.mdAndUp">
          <v-btn
            icon
            x-small
            class="ml-auto"
            @click="toggleExpand"
          >
            <v-icon
              v-if="!expandOnHover"
              :color="$vuetify.theme.dark ? 'primary': 'secondary'"
              v-text="'$radioMarked'"
            ></v-icon>
            <v-icon
              v-else
              :color="$vuetify.theme.dark ? 'primary': 'secondary'"
              v-text="'$radioBlank'"
            ></v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <perfect-scrollbar :style="`height: calc(100% - ${scrollbarHeight}px);`">
      <v-list
        dense
        shaped
        class="py-0"
      >
        <template v-for="(item, index) in items">
          <v-subheader
            :key="index"
            v-if="item.header"
            class="text-uppercase"
            v-text="$t(`modules.${item.header}`)"
          ></v-subheader>
          <v-list-item
            exact
            :key="index"
            v-else-if="item.to ===  'reports'"
            :title="$t(`reports.${item.title}`)"
            :to="{ name: item.to, query: { id: item.title } }"
            :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="$t(`modules.${item.title}`)"></v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            v-else
            :key="index"
            :to="{ name: item.title }"
            @click="setActiveApp(item)"
            :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="$t(`modules.${item.title}`)"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </perfect-scrollbar>
    <v-divider></v-divider>
    <v-list
      dense
      shaped
      class="py-1"
    >
      <v-list-item
        :key="item.title"
        :to="{ name: item.title }"
        v-for="item in adminItems"
        :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="$t(`modules.${item.title}`)"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'InfinityDrawer',
  props: {
    showDrawer: {
      default: null,
    },
    items: {
      type: Array,
      required: true,
    },
    adminItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expandOnHover: false,
    };
  },
  computed: {
    logoName() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-dark';
    },
    drawer: {
      get() {
        return this.showDrawer;
      },
      set(val) {
        this.$emit('set-drawer', val);
      },
    },
    scrollbarHeight() {
      // 64 - height of toolbar
      let totalHeight = 64;
      if (this.adminItems && this.adminItems.length) {
        // 40 - height of one admin item
        // 16 - list padding
        totalHeight += (40 * this.adminItems.length + 1 + 8);
      }
      return totalHeight;
    },
  },
  created() {
    const appId = localStorage.getItem('appId');
    this.setActiveAppId(appId ? JSON.parse(appId) : null);
  },
  methods: {
    ...mapMutations('webApp', ['setActiveAppId']),
    toggleExpand() {
      this.expandOnHover = !this.expandOnHover;
    },
    setActiveApp(item) {
      this.setActiveAppId(item.id);
      localStorage.setItem('appId', item.id);
    },
  },
};
</script>
