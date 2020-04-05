<template>
  <v-container
    fluid
    style="height:100%"
  >
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-row
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="12" md="3" lg="2">
          <v-list
            shaped
            class="pa-0 transparent"
          >
            <template v-for="(item, index) in items">
              <v-subheader
                :key="index"
                v-if="item.header"
                class="text-uppercase"
                v-text="$t(`${item.header}`)"
              ></v-subheader>
              <v-divider
                :key="index"
                v-else-if="item.divider"
              ></v-divider>
              <v-list-item
                link
                v-else
                :key="index"
                color="primary"
                :to="{ params: { id: item.to } }"
              >
                <v-list-item-title v-text="$t(`${item.title}`)"></v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="8" lg="7">
          <slot></slot>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row no-gutters>
        <v-col cols="12" v-if="showList">
          <slot name="settingsList"></slot>
          <v-list class="transparent">
            <template v-for="(item, index) in items">
              <v-subheader
                :key="index"
                v-if="item.header"
                class="text-uppercase"
                v-text="$t(`${item.header}`)"
              ></v-subheader>
              <v-divider
                :key="index"
                v-else-if="item.divider"
              ></v-divider>
              <v-list-item
                link
                v-else
                :key="index"
                color="primary"
                :to="{ params: { id: item.to } }"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text="$t(`${item.title}`)"></v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
        <v-col cols="12" v-else>
          <slot></slot>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
export default {
  name: 'SettingsLayout',
  props: {
    items: {
      type: Array,
      required: true,
    },
    windowRouteName: {
      type: String,
      required: true,
    },
  },
  created() {
    this.redirect();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    showList() {
      return this.id === undefined;
    },
  },
  watch: {
    id() {
      this.redirect();
    },
  },
  methods: {
    redirect() {
      const routes = this.items
        .filter((item) => item.to)
        .map((item) => item.to);
      if (this.id === undefined && !this.$vuetify.breakpoint.smAndDown) {
        if (this.items && this.items.length) {
          this.$router.push({ name: this.windowRouteName, params: { id: routes[0] } });
        }
      } else {
        const validId = routes.includes(this.id);
        if (!validId) {
          const invalidPath = this.$route.fullPath;
          this.$router.push({ name: '404', params: { 0: invalidPath } });
        }
      }
    },
  },
};
</script>
