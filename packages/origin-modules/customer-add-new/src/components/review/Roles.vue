<template>
  <v-card flat>
    <v-card-text class="ml-4">
      <v-row
        no-gutters
        v-for="(role, n) in roles"
        :key="n"
        class="title"
      >
        {{ role.payload.roleDescription }}
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import roles from '../../data/rolesPayload';

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
      roles,
      masterReportCategoryIds: [],
    };
  },
  methods: {
    ...mapActions('newCustomer', [
      'getModules',
      'getWebApps',
      'getReportCategories',
      'getInsightCategories',
      'createElementAccess',
      'createSolutionAccess',
      'createModuleAccess',
      'createReportAccess',
      'createReportViewAccess',
      'createInsightViewAccess',
      'createNewRole',
    ]),
    getPermissions(data) {
      const {
        createdRoleId,
        modules,
        allModules,
        allApps,
        allReportCategories,
      } = data;
      const modulePayload = {
        roleId: createdRoleId,
        moduleAndReportsCategoryIds: modules.map(({ name, items, ...m }) => {
          const payload = { ...m };
          const { id: moduleId } = allModules.find((mod) => mod.moduleName === name);
          payload.moduleId = moduleId;
          if (name === 'apps' || name === 'dashboards') {
            payload.webAppIds = items
              .map((i) => allApps
                .find((app) => app.webAppName === i)
                .id);
          } else if (name === 'reports') {
            payload.reportsCategoryIds = items
              .map((i) => allReportCategories
                .find((category) => category.reportsCategoryName === i)
                .id);
          }
          return payload;
        }),
      };
      return modulePayload;
    },
  },
  watch: {
    async loading(val) {
      if (val) {
        const success = [];
        const allModules = await this.getModules();
        const allApps = await this.getWebApps();
        const allReportCategories = await this.getReportCategories();
        const allInsightCategories = await this.getInsightCategories();
        for (let i = 0; i < this.roles.length; i += 1) {
          const { payload, modules } = this.roles[i];
          // eslint-disable-next-line
          const createdRoleId = await this.createNewRole(payload);
          if (createdRoleId) {
            const modulePayload = this.getPermissions({
              createdRoleId,
              modules,
              allModules,
              allApps,
              allReportCategories,
            });
            const reportCategoryIds = allReportCategories.map((r) => r.id);
            const insightCategoryIds = allInsightCategories.map((r) => r.id);
            // eslint-disable-next-line
            const results = await Promise.all([
              this.createElementAccess(createdRoleId),
              this.createSolutionAccess(createdRoleId),
              this.createModuleAccess(modulePayload),
              this.createReportAccess(createdRoleId),
              this.createReportViewAccess({
                reportCategoryIds,
                roleId: createdRoleId,
              }),
              this.createInsightViewAccess({
                insightCategoryIds,
                roleId: createdRoleId,
              }),
            ]);
            success.push(results.every((res) => res === true));
          }
        }
        if (success.every((c) => c === true)) {
          this.$emit('on-complete');
        }
      }
    },
  },
};
</script>
