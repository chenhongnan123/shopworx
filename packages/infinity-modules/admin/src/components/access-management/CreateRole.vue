<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        v-on="on"
        small
        color="primary"
        class="text-none"
        :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
      >
        <v-icon left small v-text="'$addRole'"></v-icon>
        {{ $t('admin.userRoles.createNew') }}
      </v-btn>
    </template>
    <v-form ref="form" v-model="isValid" @submit.prevent="createRole">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          {{ $t('admin.userRoles.createNew') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            dense
            outlined
            class="mt-1"
            v-model="roleDescription"
            :label="$t('admin.userRoles.role')"
            prepend-icon="$addRole"
            :disabled="saving"
            :rules="descriptionRules"
          ></v-text-field>
          <v-checkbox
            v-model="isAdmin"
            class="my-0"
            :label="$t('admin.userRoles.isAdminCheck')"
          ></v-checkbox>
          <div class="mb-2 font-weight-medium">
            {{ $t('admin.userRoles.roleAccess') }}
          </div>
          <v-treeview
            dense
            rounded
            open-all
            hoverable
            selectable
            transition
            open-on-click
            return-object
            v-model="permissions"
            :items="masterPermissions()"
          ></v-treeview>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text :disabled="saving" class="text-none" @click="cancel">
            {{ $t('admin.userRoles.exit') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary"
            class="text-none"
            :loading="saving"
            :disabled="!isValid || noPermission"
          >
            {{ $t('admin.userRoles.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'CreateRole',
  props: {
    roles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      isValid: false,
      saving: false,
      roleName: '',
      roleDescription: '',
      isAdmin: false,
      permissions: [],
      masterReportCategoryIds: [],
      descriptionRules: [
        (v) => !!(v && v.trim()) || this.$t('admin.userRoles.roleRequired'),
        (v) => /^[A-Za-z0-9-_ ]+$/.test(v)
          || this.$t('admin.userRoles.roleInvalid'),
        (v) => !this.roleNames.includes(this.getRoleName(v))
          || this.$t('admin.userRoles.roleExists'),
      ],
    };
  },
  computed: {
    ...mapState('admin', ['masterSolutions']),
    noPermission() {
      return this.permissions.length === 0;
    },
    roleNames() {
      return this.roles.map((r) => r.roleName);
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('admin', [
      'createNewRole',
      'createElementAccess',
      'createSolutionAccess',
      'createModuleAccess',
      'createReportAccess',
      'createReportViewAccess',
    ]),
    getRoleName(description) {
      return description
        ? description
          .toLowerCase()
          .replace(/\W/g, '')
          .replace(/-/g, '')
          .replace(/_/g, '')
          .split(' ')
          .join('')
        : '';
    },
    removeDuplicates(myArr, prop) {
      return myArr.filter(
        (obj, pos, arr) => arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos,
      );
    },
    masterPermissions() {
      const modules = [];
      if (this.masterSolutions && this.masterSolutions.length) {
        this.masterSolutions.forEach((solution) => solution.modules.map((module) => {
          if (
            module.moduleName.toUpperCase().trim() === 'APPS'
              || module.moduleName.toUpperCase().trim() === 'DASHBOARDS'
              || module.moduleName.toUpperCase().trim() === 'OPERATION'
              || module.moduleName.toUpperCase().trim() === 'MANAGEMENT'
              || module.moduleName.toUpperCase().trim() === 'CONFIGURATION'
          ) {
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
            this.masterReportCategoryIds = this.removeDuplicates(module.details, 'id')
              .map((detail) => detail.id);
            modules.push({
              id: module.id,
              name: this.$i18n.t(`modules.${module.moduleName}`),
              children: this.removeDuplicates(module.details, 'id').map(
                (detail) => ({
                  moduleId: module.id,
                  moduleName: module.moduleName,
                  id: detail.id,
                  name: this.$i18n.t(`modules.${detail.reportsCategoryName}`),
                }),
              ),
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
    clear() {
      this.roleName = '';
      this.roleDescription = '';
      this.permissions = [];
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.dialog = false;
    },
    getPermissions(roleId) {
      const permissionsByModule = this.permissions.reduce(
        (result, currentValue) => {
          const { moduleId } = currentValue;
          if (!result[moduleId]) {
            result[moduleId] = [];
          }
          result[moduleId].push(currentValue);
          return result;
        }, {},
      );
      const payload = {
        roleId,
        moduleAndReportsCategoryIds: Object.keys(permissionsByModule).map(
          (moduleId) => {
            const enterpriseMode = false;
            const mod = {
              moduleId: parseInt(moduleId, 10),
              enterpriseMode,
            };
            const modules = permissionsByModule[moduleId];
            if (
              modules[0].moduleName.toUpperCase().trim() === 'APPS'
              || modules[0].moduleName.toUpperCase().trim() === 'DASHBOARDS'
              || modules[0].moduleName.toUpperCase().trim() === 'OPERATION'
              || modules[0].moduleName.toUpperCase().trim() === 'MANAGEMENT'
              || modules[0].moduleName.toUpperCase().trim() === 'CONFIGURATION'
            ) {
              mod.webAppIds = modules.map((m) => m.id);
            } else if (
              modules[0].moduleName.toUpperCase().trim() === 'REPORTS'
            ) {
              mod.reportsCategoryIds = modules.map((m) => m.id);
            }
            return mod;
          },
        ),
      };
      return payload;
    },
    async createRole() {
      this.saving = true;
      const payload = {
        roleName: this.getRoleName(this.roleDescription),
        roleDescription: this.roleDescription,
        roleType: this.isAdmin ? 'ADMINISTRATOR' : 'USER',
      };
      const createdRoleId = await this.createNewRole(payload);
      if (createdRoleId) {
        const modulePayload = this.getPermissions(createdRoleId);
        const results = await Promise.all([
          this.createElementAccess(createdRoleId),
          this.createSolutionAccess(createdRoleId),
          this.createModuleAccess(modulePayload),
          this.createReportAccess(createdRoleId),
          this.createReportViewAccess({
            reportCategoryIds: this.masterReportCategoryIds,
            roleId: createdRoleId,
          }),
        ]);
        const success = results.every((res) => res === true);
        if (success) {
          this.cancel();
          this.$emit('on-success');
          this.setAlert({
            show: true,
            type: 'success',
            message: 'ROLE_CREATED',
          });
        } else {
          this.cancel();
          this.$emit('on-success');
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ROLE_CREATE_RETRY',
          });
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ROLE_CREATED',
        });
      }
      this.saving = false;
    },
  },
};
</script>
