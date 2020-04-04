<template>
  <v-navigation-drawer
    app
    dark
    floating
    v-model="drawer"
    color="#212121"
    :expand-on-hover="expandOnHover && $vuetify.breakpoint.lgAndUp"
  >
    <v-list shaped class="py-1">
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
        shaped
        dense
      >
        <template v-for="(item, index) in items">
          <v-subheader
            :key="index"
            v-if="item.header"
            class="text-uppercase"
            v-text="$t(`modules.${item.header}`)"
          ></v-subheader>
          <v-list-group
            :key="index"
            :group="item.group"
            :prepend-icon="item.icon"
            v-else-if="item.children"
            :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
          >
            <template #activator>
              <v-list-item-title
                v-text="$t(`modules.${item.title}`)"
              ></v-list-item-title>
            </template>
            <v-list-item
              exact
              :key="child.param"
              :title="$t(`reports.${child.param}`)"
              v-for="child in item.children"
              :to="{ path: child.to, params: { id: child.param } }"
              :color="$vuetify.theme.dark ? 'primary' : 'secondary'"
            >
              <v-list-item-icon>
                <span class="mx-auto" v-text="child.avatarText"></span>
              </v-list-item-icon>
              <v-list-item-title
                v-text="$t(`reports.${child.param}`)"
              ></v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item
            link
            v-else
            :key="index"
            :to="{ path: item.to }"
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
    <v-list shaped dense>
      <v-list-item
        v-for="item in adminItems"
        :key="item.title"
        :to="{ path: item.to }"
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
export default {
  name: 'InfinityDrawer',
  props: {
    showDrawer: {
      type: Boolean,
      required: true,
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
        totalHeight += (40 * this.adminItems.length + 16);
      }
      return totalHeight;
    },
  },
  methods: {
    toggleExpand() {
      this.expandOnHover = !this.expandOnHover;
    },
  },
};
</script>
