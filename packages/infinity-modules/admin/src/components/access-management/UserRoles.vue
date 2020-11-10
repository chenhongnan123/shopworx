<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          color="primary"
          class="text-none"
          disabled
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          <v-icon
            left
            small
            v-text="'$addRole'"
          ></v-icon>
          Create new role
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          @click="refresh"
          class="text-none ml-2"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          Refresh
        </v-btn>
      </span>
    </portal>
    <v-progress-circular
      indeterminate
      v-if="loading"
    ></v-progress-circular>
    <v-card flat class="transparent" v-else>
      <v-card-text class="pa-0">
        <v-row justify="center">
          <v-col cols="6">
            <v-card outlined class="text-center">
              <div class="title">
                Admin roles
              </div>
              <div class="headline">
                {{ adminCount }}
              </div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card outlined class="text-center">
              <div class="title">
                Other roles
              </div>
              <div class="headline">
                {{ nonAdminCount }}
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-data-table
          item-key="roleId"
          class="transparent"
          :search="search"
          :items="userRoles"
          :headers="headers"
          show-expand
          single-expand
          :expanded.sync="expanded"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.roleType="{ item }">
            <v-switch
              value
              dense
              :disabled="item.roleName === 'admin'"
              :input-value="item.roleType === roleTypes.admin"
              @change="updateRoleType(item)"
            ></v-switch>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              small
              disabled
              color="error"
              @click="deleteRole(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$delete'"></v-icon>
            </v-btn>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
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
                  :items="masterPermissions"
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
  </div>
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
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
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
    adminCount() {
      let count = 0;
      if (this.roles && this.roles.length) {
        const roles = this.roles.filter((role) => (
          role.roleType.toUpperCase() === this.roleTypes.admin
        ));
        count = roles.length;
      }
      return count;
    },
    nonAdminCount() {
      let count = 0;
      if (this.roles && this.roles.length) {
        const roles = this.roles.filter((role) => (
          role.roleType.toUpperCase() !== this.roleTypes.admin
        ));
        count = roles.length;
      }
      return count;
    },
    masterPermissions() {
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
            });
          }
          return modules;
        }));
      }
      return modules;
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
