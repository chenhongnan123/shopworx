<template>
  <v-container fluid style="height:100%">
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <portal to="app-header">
        <v-btn class="mb-1" icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span>Settings</span>
      </portal>
      <v-row style="height:100%">
        <v-col cols="12" md="3" xl="2" style="">
          <v-list shaped class="pa-0 transparent">
            <template v-for="(item, index) in items">
              <v-subheader
                :key="index"
                v-if="item.header"
                class="text-uppercase"
                v-text="$t(`${item.header}`)"
              ></v-subheader>
              <v-divider :key="index" v-else-if="item.divider"></v-divider>
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
        <v-col cols="12" md="8" xl="9">
          <v-card flat class="transparent" style="height:100%">
            <v-card-title primary-title>
              {{ $t(`${selectedTitle}`) }}
              <v-spacer></v-spacer>
              <portal-target name="settings-header"></portal-target>
            </v-card-title>
            <v-card-text style="height: calc(100% - 70px);">
              <v-fade-transition mode="out-in">
                <settings-window />
              </v-fade-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <portal to="app-header" v-if="id">
        {{ $t(`${selectedTitle}`) }}
      </portal>
      <portal to="app-header" v-else>
        <v-btn class="mb-1" icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span>Settings</span>
        <portal-target name="settings-header" slim />
      </portal>
      <v-row no-gutters>
        <v-col cols="12" v-if="showList">
          <v-list class=" pa-0 transparent">
            <template v-for="(item, index) in items">
              <v-subheader
                :key="index"
                v-if="item.header"
                class="text-uppercase"
                v-text="$t(`${item.header}`)"
              ></v-subheader>
              <v-divider :key="index" v-else-if="item.divider"></v-divider>
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
          <v-card flat class="transparent">
            <v-card-text>
              <v-fade-transition mode="out-in">
                <settings-window />
              </v-fade-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import SettingsWindow from '../components/settings/SettingsWindow.vue';

export default {
  name: 'OperatorSettings',
  components: {
    SettingsWindow,
  },
  data() {
    return {
      items: [
        {
          header: 'operator.settings.general',
        },
        {
          title: 'operator.general.department',
          to: 'department',
        },
        {
          title: 'operator.general.position',
          to: 'position',
        },
      ],
      routes: [],
    };
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
    selectedTitle() {
      let title = '';
      const item = this.routes.find((r) => r.to === this.id);
      if (item) {
        ({ title } = item);
      }
      return title;
    },
  },
  watch: {
    id() {
      this.redirect();
    },
    // eslint-disable-next-line
    '$vuetify.breakpoint.name'() {
      this.redirect();
    },
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'operator' });
    },
    redirect() {
      this.routes = this.items.filter((item) => item.to);
      const to = this.routes.map((item) => item.to);
      if (this.id === undefined && this.$vuetify.breakpoint.mdAndUp) {
        if (this.items && this.items.length) {
          this.$router.push({ params: { id: to[0] } });
        }
      } else if (this.id && this.$vuetify.breakpoint.mdAndUp) {
        const validId = to.includes(this.id);
        if (!validId) {
          const invalidPath = this.$route.fullPath;
          this.$router.push({ name: '404', params: { 0: invalidPath } });
        }
      }
    },
  },
};
</script>
