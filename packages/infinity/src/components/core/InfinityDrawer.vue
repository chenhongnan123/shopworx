<template>
  <v-navigation-drawer
    app
    dark
    floating
    color="#212121"
    v-model="drawer"
    :mini-variant="isMini"
    :expand-on-hover="canHover"
    @transitionend="toggleMini"
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
        nav
        dense
        :rounded="expandOnHover"
        :shaped="!expandOnHover"
      >
        <template v-for="(item, index) in drawerItems">
          <v-subheader
            :key="index"
            v-if="item.header && !expandOnHover"
            class="text-uppercase"
            v-text="$t(`modules.${item.header}`)"
          ></v-subheader>
          <v-divider
            :key="index"
            class="my-1"
            v-else-if="item.header && expandOnHover"
          ></v-divider>
          <v-list-item
            exact
            :key="index"
            v-else-if="item.to === 'reports'"
            :title="$t(`modules.${item.title}`)"
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
            :key="index"
            v-else-if="item.external"
            target="_blank"
            :href="item.to"
            @click="setActiveExternalApp(item)"
            :title="$t(`modules.${item.title}`)"
            :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="$t(`modules.${item.title}`)"></v-list-item-title>
            <v-list-item-action v-if="item.external">
              <v-icon small class="mb-1">mdi-open-in-new</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            link
            v-else
            :key="index"
            :to="{ name: item.title }"
            @click="setActiveApp(item)"
            :title="$t(`modules.${item.title}`)"
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
    <template v-if="drawerAdminItems && drawerAdminItems.length">
      <v-divider
        class="mt-2"
      ></v-divider>
      <v-list
        nav
        dense
        :rounded="expandOnHover"
        :shaped="!expandOnHover"
      >
        <v-list-item
          :key="item.title"
          :to="{ name: item.title }"
          v-for="item in drawerAdminItems"
          :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="$t(`modules.${item.title}`)"></v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapMutations } from 'vuex';
import { onExternalAppClick } from '../../infinityLoader';

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
      miniVariant: false,
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    canHover() {
      return this.expandOnHover && this.$vuetify.breakpoint.lgAndUp;
    },
    isMini() {
      return this.miniVariant && this.$vuetify.breakpoint.lgAndUp;
    },
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
    drawerItems() {
      let items = [...this.items];
      if (this.isMobile) {
        items = this.items.filter((i) => {
          const isReportHeader = i.header === 'reports';
          const areReportItems = i.to && i.to.includes('reports');
          return !isReportHeader && !areReportItems;
        });
      }
      return items;
    },
    drawerAdminItems() {
      return this.isMobile ? [] : this.adminItems;
    },
    scrollbarHeight() {
      // 64 - height of toolbar
      let totalHeight = 64;
      if (this.drawerAdminItems && this.drawerAdminItems.length) {
        // 40 - height of one admin item
        // 16 - list padding
        totalHeight += (40 * this.drawerAdminItems.length + 16 + 16 + 1);
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
      if (!this.expandOnHover) {
        this.miniVariant = this.expandOnHover;
      }
    },
    toggleMini() {
      if (this.expandOnHover) {
        this.miniVariant = this.expandOnHover;
      }
    },
    setActiveApp(item) {
      this.setActiveAppId(item.id);
      localStorage.setItem('appId', item.id);
    },
    setActiveExternalApp(item) {
      onExternalAppClick(item.to);
    },
  },
};
</script>
