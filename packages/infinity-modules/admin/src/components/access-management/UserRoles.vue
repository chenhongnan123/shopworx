<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          color="primary"
          class="text-none"
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
          class="text-none ml-2"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          Refresh
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
        >
          <v-icon small v-text="'$download'" left></v-icon>
          Export roles
          <v-icon small v-text="'mdi-chevron-down'" right></v-icon>
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
          item-key="id"
          class="transparent"
          :search="search"
          :items="userRoles"
          :headers="headers"
          show-expand
          single-expand
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.roleType="{ item }">
            <v-switch
              value
              dense
              :input-value="item.roleType === roleTypes.admin"
            ></v-switch>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              small
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
                {{ item.permissions }}
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
                  text
                  color="primary"
                  class="text-none"
                >
                  Reset
                </v-btn>
                <v-btn
                  color="primary"
                  class="text-none"
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
import { mapActions, mapState } from 'vuex';

export default {
  name: 'UserRoles',
  data() {
    return {
      roleTypes: {
        admin: 'ADMINISTRATOR',
        user: 'USER',
      },
      search: null,
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
        return this.roles.map((role) => ({
          ...role,
          permissions: [],
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
          if (module.moduleName.toUpperCase().trim() === 'APPS') {
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              children: module.details.map((detail) => ({
                ...detail,
                name: this.$i18n.t(`modules.${detail.webAppName}`),
              })),
            });
          } else if (module.moduleName.toUpperCase().trim() === 'REPORTS') {
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              children: this.removeDuplicates(module.details, 'id').map((detail) => ({
                ...detail,
                name: this.$i18n.t(`modules.${detail.reportsCategoryName}`),
              })),
            });
          } else {
            modules.push({
              ...module,
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
    await this.getMasterSolutions();
    await this.getUserRoles();
    this.loading = false;
  },
  methods: {
    ...mapActions('user', ['getUserRoles']),
    ...mapActions('admin', ['getMasterSolutions']),
    deleteRole() {},
    removeDuplicates(myArr, prop) {
      return myArr
        .filter((obj, pos, arr) => arr
          .map((mapObj) => mapObj[prop])
          .indexOf(obj[prop]) === pos);
    },
    getRolePermissions(role) {
      const modules = [];
      const roleModules = role.modules;
      const roleModulesIds = roleModules.map((mod) => mod.id);
      const roleAppIds = roleModules
        .find((mod) => mod.moduleName.toUpperCase().trim() === 'APPS')
        .details.map((detail) => detail.id);
      const roleReportCategoryIds = roleModules
        .find((mod) => mod.moduleName.toUpperCase().trim() === 'REPORTS')
        .details.map((detail) => detail.id);
      if (this.masterSolutions && this.masterSolutions.length) {
        this.masterSolutions.forEach((solution) => solution.modules.map((module) => {
          if (module.moduleName.toUpperCase().trim() === 'APPS') {
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              children: module.details.map((detail) => ({
                ...detail,
                selected: roleAppIds.includes(detail.id),
                name: this.$i18n.t(`modules.${detail.webAppName}`),
              })),
            });
          } else if (module.moduleName.toUpperCase().trim() === 'REPORTS') {
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              children: this.removeDuplicates(module.details, 'id').map((detail) => ({
                ...detail,
                selected: roleReportCategoryIds.includes(detail.id),
                name: this.$i18n.t(`modules.${detail.reportsCategoryName}`),
              })),
            });
          } else {
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              selected: roleModulesIds.includes(module.id),
              children: [],
            });
          }
          return modules;
        }));
      }
      return modules;
    },
  },
};
</script>
