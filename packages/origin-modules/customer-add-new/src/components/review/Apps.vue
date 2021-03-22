<template>
  <v-card flat>
    <v-card-text class="ml-4">
      <v-row
        no-gutters
        v-for="(app, n) in apps"
        :key="n"
        class="title"
      >
        {{ app.payload.webAppDescription }}
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import apps from '../../data/webappsPayload';

export default {
  name: 'Apps',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      apps,
    };
  },
  methods: {
    ...mapActions('newCustomer', ['addWebapp', 'getModules']),
  },
  watch: {
    async loading(val) {
      if (val) {
        const modules = await this.getModules();
        if (modules && modules.length) {
          const created = [];
          for (let i = 0; i < this.apps.length; i += 1) {
            const app = this.apps[i];
            const { payload } = app;
            const module = modules.find((m) => m.moduleName === payload.moduleName);
            if (module) {
              payload.moduleId = module.id;
              delete payload.moduleName;
            }
            // eslint-disable-next-line
            const added = await this.addWebapp(payload);
            created.push(added);
          }
          if (created.every((c) => c)) {
            this.$emit('on-complete');
          }
        }
      }
    },
  },
};
</script>
