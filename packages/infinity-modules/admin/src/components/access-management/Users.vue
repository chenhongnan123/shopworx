<template>
  <div>
    <portal to="settings-header">
      <span class="d-flex align-center">
        <invite-users @invited="onInvited" />
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="fetchUsers"
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
      <template v-if="pendingUsers && pendingUsers.length">
        <v-card-title class="px-0">
          Pending invitations
        </v-card-title>
        <v-card-text class="pa-0 mb-4">
          <v-data-table
            item-key="id"
            class="transparent"
            disable-pagination
            :items="pendingUsers"
            hide-default-footer
            :headers="pendingHeaders"
          >
            <!-- eslint-disable-next-line -->
            <template #item.email="{ item }">
              <div>{{ item.email || item.phone }}</div>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.role="{ item }">
              <div>{{ roles.find((role) => role.roleId === item.role).roleDescription }}</div>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.actions="{ item }">
              <v-btn
                small
                outlined
                color="primary"
                class="text-none"
                @click="resendInvite(item)"
                :loading="inviteLoading"
              >
                Resend
              </v-btn>
              <delete-user :user="item" />
            </template>
          </v-data-table>
        </v-card-text>
      </template>
      <v-card-text class="pa-0">
        <v-text-field
          dense
          rounded
          outlined
          single-line
          hide-details
          id="searchUsers"
          v-model="search"
          prepend-inner-icon="$search"
          label="Filter users by name"
        ></v-text-field>
        <v-data-table
          item-key="id"
          class="transparent"
          :search="search"
          :items="mappedUsers"
          :headers="headers"
          disable-pagination
          hide-default-footer
        >
          <!-- eslint-disable-next-line -->
          <template #item.fullName="{ item }">
            <div>{{ item.fullName }}</div>
            <div>{{ item.email }}</div>
            <div>{{ item.phone }}</div>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.role="{ item }">
            <v-select
              dense
              flat
              solo
              hide-details
              :items="roles"
              @change="updateRole(item)"
              v-model="item.role"
              item-value="roleId"
              :id="`user-${item.id}`"
              item-text="roleDescription"
            ></v-select>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.actions="{ item }">
            <delete-user :user="item" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import InviteUsers from './InviteUsers.vue';
import DeleteUser from './DeleteUser.vue';

export default {
  name: 'Users',
  components: {
    InviteUsers,
    DeleteUser,
  },
  data() {
    return {
      search: null,
      loading: false,
      inviteLoading: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'fullName',
        },
        {
          text: 'Role',
          align: 'start',
          sortable: true,
          value: 'role',
        },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
      pendingHeaders: [
        {
          text: 'Email or phone',
          align: 'start',
          sortable: false,
          value: 'email',
        },
        {
          text: 'Role',
          align: 'start',
          sortable: false,
          value: 'role',
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
    ...mapState('admin', ['users']),
    mappedUsers() {
      let users = [];
      if (this.users && this.users.length) {
        users = this.users
          .filter((user) => (
            user.userState !== 'REGISTERED'
            && user.userState !== 'INACTIVE'
            && user.loginType.toUpperCase() === 'INFINITY'
          ))
          .map((user) => {
            const fullName = user.firstname ? `${user.firstname} ${user.lastname}` : '';
            return {
              fullName,
              id: user.id,
              role: user.roleId,
              email: user.emailId,
              phone: user.phoneNumber,
              status: user.userState,
            };
          });
      }
      return users;
    },
    pendingUsers() {
      let users = [];
      if (this.users && this.users.length) {
        users = this.users
          .filter((user) => (
            user.userState === 'REGISTERED'
            && user.loginType.toUpperCase() === 'INFINITY'
          ))
          .map((user) => ({
            id: user.id,
            role: user.roleId,
            email: user.emailId,
            phone: user.phoneNumber,
          }));
      }
      return users;
    },
  },
  async created() {
    await this.getUserRoles();
    await this.fetchUsers();
  },
  methods: {
    ...mapActions('user', ['inviteUsers', 'getUserRoles']),
    ...mapActions('admin', [
      'getAllUsers',
      'resendInvitation',
      'updateUserRole',
    ]),
    ...mapMutations('helper', ['setAlert']),
    async fetchUsers() {
      this.loading = true;
      await this.getAllUsers();
      this.loading = false;
    },
    async onInvited() {
      await this.fetchUsers();
    },
    async resendInvite(user) {
      this.inviteLoading = true;
      let payload = null;
      if (user.email) {
        payload = [user.email];
      } else if (user.phone) {
        payload = [user.phone];
      }
      const invited = await this.resendInvitation(payload);
      if (invited && invited.length) {
        if (invited.some((u) => !u.created)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'INVITE_FAILED',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'INVITE_SENT',
          });
        }
      }
      this.inviteLoading = false;
    },
    updateRole(user) {
      this.updateUserRole({
        userId: user.id,
        roleId: user.role,
      });
    },
  },
};
</script>
