<template>
  <v-navigation-drawer
    app
    floating
    v-model="sidebarInput"
    :expand-on-hover="canHover"
    :mini-variant="isMini"
    @transitionend="toggleMini"
    :color="$vuetify.theme.dark ? '#1F1F1F' : 'white'"
  >
    <v-list shaped class="py-1">
      <v-list-item>
        <v-list-item-icon>
          <v-icon
            color="primary"
            v-text="icon"
          ></v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <img
            :src="require(`@shopworx/assets/logos/${logoName}.png`)"
            contain
            class="mb-2"
            height="38"
          />
        </v-list-item-title>
        <v-list-item-action v-if="$vuetify.breakpoint.mdAndUp">
          <v-btn icon @click="toggleExpand" x-small class="ml-auto">
            <v-icon
              v-if="!expand"
              color="primary"
              v-text="'$radioMarked'"
            ></v-icon>
            <v-icon
              v-else
              color="primary"
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
            v-text="$t(`infinity.modules.${item.header}`)"
          ></v-subheader>
          <v-list-group
            :key="index"
            :group="item.group"
            :prepend-icon="item.icon"
            v-else-if="item.children"
            :active-class="$vuetify.theme.dark ? 'highlighted-dark' : 'highlighted'"
          >
            <template #activator>
              <v-list-item-title
                v-text="$t(`infinity.modules.${item.title}`)"
              ></v-list-item-title>
            </template>
            <v-list-item
              exact
              :key="child.param"
              :title="$t(`infinity.reports.${child.param}`)"
              v-for="child in item.children"
              :to="{ name: child.to, params: { id: child.param } }"
              :active-class="$vuetify.theme.dark ? 'highlighted-dark' : 'highlighted'"
            >
              <v-list-item-icon>
                <span class="mx-auto" v-text="child.avatarText"></span>
              </v-list-item-icon>
              <v-list-item-title
                v-text="$t(`infinity.reports.${child.param}`)"
              ></v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item
            link
            v-else
            :key="index"
            :to="{ name: item.to }"
            :active-class="$vuetify.theme.dark ? 'highlighted-dark' : 'highlighted'"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="$t(`infinity.modules.${item.title}`)"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </perfect-scrollbar>
    <v-list shaped dense>
      <v-list-item
        v-for="item in adminItems"
        :key="item.title"
        :to="{ name: item.to }"
        :active-class="$vuetify.theme.dark ? 'highlighted-dark' : 'highlighted'"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="$t(`infinity.modules.${item.title}`)"></v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list shaped dense>
      <v-list-item>
        <v-list-item-icon>
          <v-icon
            color="primary"
            v-text="'$help'"
          ></v-icon>
        </v-list-item-icon>
        <v-list-item-title
          class="primary--text font-weight-medium"
          v-text="$t('infinity.help.title')"
        >
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    showSidebar: {
      type: Boolean,
      required: true,
    },
    icon: {
      type: String,
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
      expand: true,
      mini: true,
    };
  },
  computed: {
    logoName() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
    sidebarInput: {
      get() {
        return this.showSidebar;
      },
      set(val) {
        this.$emit('set-sidebar', val);
      },
    },
    isMini() {
      return this.mini && this.$vuetify.breakpoint.lgAndUp;
    },
    canHover() {
      return this.expand && this.$vuetify.breakpoint.lgAndUp;
    },
    scrollbarHeight() {
      // 56 - height of help button
      // 64 - height of toolbar
      let totalHeight = 57 + 64;
      if (this.adminItems && this.adminItems.length) {
        // 40 - height of one admin item
        // 16 - list padding
        totalHeight += (40 * this.adminItems.length + 16);
      }
      return totalHeight;
    },
  },
  methods: {
    toggleMini() {
      if (this.expand) {
        this.mini = this.expand;
      }
    },
    toggleExpand() {
      this.expand = !this.expand;
      if (!this.expand) {
        this.mini = this.expand;
      }
    },
  },
};
</script>

<style scoped>
.highlighted-dark {
  background-color: var(--v-primary-base);
  color: #212121
}
.highlighted {
  background-color: var(--v-primary-base);
  color: #ffffff
}
</style>
