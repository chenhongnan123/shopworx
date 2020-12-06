<template>
  <v-card
    height="100%"
    rounded="lg"
  >
    <v-card-title>
      User roles
    </v-card-title>
    <v-card-text>
      <v-data-table
        item-key="roleId"
        class="transparent"
        :search="search"
        :items="userRoles"
        :headers="headers"
        show-expand
        dense
        single-expand
        :expanded.sync="expanded"
        disable-pagination
        hide-default-footer
      >
        <!-- eslint-disable-next-line -->
        <template #item.roleType="{ item }">
          <v-switch
            value
            dense
            :disabled="item.roleName === 'admin'"
            :input-value="item.roleType === roleTypes.admin"
            @change="updateRoleType(item)"
          ></v-switch>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card-text>
              <v-treeview
                dense
                rounded
                open-all
                hoverable
                selectable
                transition
                open-on-click
                return-object
                v-model="item.permissions"
                :items="masterPermissions(item.roleName)"
              ></v-treeview>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :loading="saving"
                color="primary"
                class="text-none"
                @click="updatePermission(item)"
                :disabled="!item.permissions.length"
              >
                Update permissions
              </v-btn>
            </v-card-actions>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  name: 'UserRoles',
  data() {
    return {
      expanded: [],
      roleTypes: {
        admin: 'ADMINISTRATOR',
        user: 'USER',
      },
      search: null,
      saving: false,
      loading: false,
      deleting: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'roleDescription',
        },
        {
          text: 'Is admin?',
          align: 'start',
          sortable: false,
          value: 'roleType',
        },
      ],
    };
  },
  computed: {
    ...mapState('user', ['roles']),
    ...mapState('admin', ['masterSolutions']),
    userRoles() {
      if (this.roles && this.roles.length) {
        return sortArray(this.roles, 'roleName').map((role) => ({
          ...role,
          permissions: this.getRolePermissions(role),
          active: [],
        }));
      }
      return [];
    },
  },
  async created() {
    this.loading = true;
    await this.fetchRoles();
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('user', ['getUserRoles']),
    ...mapActions('admin', [
      'getMasterSolutions',
      'updateRole',
      'deleteModuleAccess',
      'deleteWebAppAccess',
      'deleteReportsCategoryAccess',
      'createAccess',
    ]),
    async refresh() {
      this.loading = true;
      await this.fetchRoles();
      this.loading = false;
    },
    async fetchRoles() {
      await this.getMasterSolutions();
      await this.getUserRoles();
    },
    removeDuplicates(myArr, prop) {
      return myArr
        .filter((obj, pos, arr) => arr
          .map((mapObj) => mapObj[prop])
          .indexOf(obj[prop]) === pos);
    },
    async updateRoleType(role) {
      let roleType = '';
      if (role.roleType === this.roleTypes.admin) {
        roleType = this.roleTypes.user;
      } else {
        roleType = this.roleTypes.admin;
      }
      const payload = {
        roleName: role.roleName,
        roleDescription: role.roleDescription,
        roleType,
      };
      const success = await this.updateRole(payload);
      if (success) {
        await this.fetchRoles();
      }
    },
    masterPermissions(roleName) {
      const modules = [];
      if (this.masterSolutions && this.masterSolutions.length) {
        this.masterSolutions.forEach((solution) => solution.modules.map((module) => {
          if (module.moduleName.toUpperCase().trim() === 'APPS' || module.moduleName.toUpperCase().trim() === 'DASHBOARDS') {
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              children: module.details.map((detail) => ({
                moduleId: module.id,
                moduleName: module.moduleName,
                id: detail.id,
                name: this.$i18n.t(`modules.${detail.webAppName}`),
              })),
            });
          } else if (module.moduleName.toUpperCase().trim() === 'REPORTS') {
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              children: this.removeDuplicates(module.details, 'id').map((detail) => ({
                moduleId: module.id,
                moduleName: module.moduleName,
                id: detail.id,
                name: this.$i18n.t(`modules.${detail.reportsCategoryName}`),
              })),
            });
          } else if (module.moduleName.toUpperCase().trim() !== 'INSIGHTS') {
            modules.push({
              moduleId: module.id,
              moduleName: module.moduleName,
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              disabled: module.moduleName.toUpperCase().trim() === 'ADMIN'
                && roleName === 'admin',
            });
          }
          return modules;
        }));
      }
      return modules;
    },
    getRolePermissions(role) {
      let modules = [];
      const roleModules = role.modules;
      const roleModulesIds = roleModules.map((mod) => mod.id);
      const webAppModule = roleModules
        .find((mod) => mod.moduleName.toUpperCase().trim() === 'APPS');
      const roleAppIds = webAppModule
        ? webAppModule.details.map((detail) => detail.id)
        : [];
      const dashboardModule = roleModules
        .find((mod) => mod.moduleName.toUpperCase().trim() === 'DASHBOARDS');
      const roleDashboardIds = dashboardModule
        ? dashboardModule.details.map((detail) => detail.id)
        : [];
      const reportModule = roleModules.find((mod) => mod.moduleName.toUpperCase().trim() === 'REPORTS');
      const roleReportCategoryIds = reportModule
        ? reportModule.details.map((detail) => detail.id)
        : [];
      if (this.masterSolutions && this.masterSolutions.length) {
        this.masterSolutions.forEach((solution) => solution.modules.map((module) => {
          if (module.moduleName.toUpperCase().trim() === 'APPS') {
            if (module.details.filter((detail) => roleAppIds.includes(detail.id)).length) {
              const appModules = module.details
                .filter((detail) => roleAppIds.includes(detail.id))
                .map((detail) => ({
                  moduleId: module.id,
                  moduleName: module.moduleName,
                  id: detail.id,
                  name: detail.webAppName,
                }));
              modules = [...modules, ...appModules];
            }
          } else if (module.moduleName.toUpperCase().trim() === 'DASHBOARDS') {
            if (module.details.filter((detail) => roleDashboardIds.includes(detail.id)).length) {
              const dashboardModules = module.details
                .filter((detail) => roleDashboardIds.includes(detail.id))
                .map((detail) => ({
                  moduleId: module.id,
                  moduleName: module.moduleName,
                  id: detail.id,
                  name: detail.webAppName,
                }));
              modules = [...modules, ...dashboardModules];
            }
          } else if (module.moduleName.toUpperCase().trim() === 'REPORTS') {
            if (module.details
              .filter((detail) => roleReportCategoryIds.includes(detail.id)).length) {
              const reportModules = module.details
                .filter((detail) => roleReportCategoryIds.includes(detail.id))
                .map((detail) => ({
                  moduleId: module.id,
                  moduleName: module.moduleName,
                  id: detail.id,
                  name: detail.reportsCategoryName,
                }));
              modules = [...modules, ...reportModules];
            }
          } else if (roleModulesIds.includes(module.id)) {
            modules = [...modules, {
              moduleId: module.id,
              moduleName: module.moduleName,
              id: module.id,
              name: module.moduleName,
            }];
          }
          return modules;
        }));
      }
      return modules;
    },
    async updatePermission(item) {
      this.saving = true;
      const results = await Promise.all([
        this.deleteModuleAccess(item.roleId),
        this.deleteWebAppAccess(item.roleId),
        this.deleteReportsCategoryAccess(item.roleId),
      ]);
      if (results.every((res) => res === true)) {
        const permissionsByModule = item.permissions.reduce((result, currentValue) => {
          const { moduleId } = currentValue;
          if (!result[moduleId]) {
            // eslint-disable-next-line
            result[moduleId] = [];
          }
          result[moduleId].push(currentValue);
          return result;
        }, {});
        const payload = {
          roleId: item.roleId,
          moduleAndReportsCategoryIds: Object.keys(permissionsByModule).map((moduleId) => {
            const enterpriseMode = false;
            const mod = {
              moduleId: parseInt(moduleId, 10),
              enterpriseMode,
            };
            const modules = permissionsByModule[moduleId];
            if (modules[0].moduleName.toUpperCase().trim() === 'APPS'
              || modules[0].moduleName.toUpperCase().trim() === 'DASHBOARDS') {
              mod.webAppIds = modules.map((m) => m.id);
            } else if (modules[0].moduleName.toUpperCase().trim() === 'REPORTS') {
              mod.reportsCategoryIds = modules.map((m) => m.id);
            }
            return mod;
          }),
        };
        const created = await this.createAccess(payload);
        if (created) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'PERMISSION_UPDATE',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'PERMISSION_UPDATE',
          });
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PERMISSION_UPDATE',
        });
      }
      this.saving = false;
    },
  },
};
</script>
