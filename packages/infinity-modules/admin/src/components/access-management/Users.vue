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
            v-text="'$invite'"
          ></v-icon>
          Invite users
        </v-btn>
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
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="fetchUsers"
        >
          <v-icon small v-text="'$download'" left></v-icon>
          Export users
          <v-icon small v-text="'mdi-chevron-down'" right></v-icon>
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
            <template v-slot:item.email="{ item }">
              <div>{{ item.email || item.phone }}</div>
            </template>
            <template v-slot:item.role="{ item }">
              <v-select
                dense
                flat
                solo
                hide-details
                :items="roles"
                v-model="item.role"
                item-value="roleId"
                :id="`user-${item.id}`"
                item-text="roleDescription"
              ></v-select>
            </template>
            <template v-slot:item.actions="{ item }">
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
              <v-btn
                icon
                small
                color="error"
                :loading="deleting"
                @click="deleteUser(item)"
              >
                <v-icon v-text="'$delete'"></v-icon>
              </v-btn>
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
          label="Search users by name"
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
          <template v-slot:item.fullName="{ item }">
            <div>{{ item.fullName }}</div>
            <div>{{ item.email }}</div>
            <div>{{ item.phone }}</div>
          </template>
          <template v-slot:item.role="{ item }">
            <v-select
              dense
              flat
              solo
              hide-details
              :items="roles"
              v-model="item.role"
              item-value="roleId"
              :id="`user-${item.id}`"
              item-text="roleDescription"
            ></v-select>
          </template>
          <template v-slot:item.status="{ item }">
            <v-switch
              value
              dense
              :input-value="item.status === 'ACTIVE' || item.status === 'RESET'"
            ></v-switch>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              small
              color="error"
              @click="deleteUser(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$delete'"></v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'Users',
  data() {
    return {
      search: null,
      loading: false,
      deleting: false,
      inviteLoading: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'fullName',
        },
        {
          text: 'Role',
          align: 'start',
          sortable: false,
          value: 'role',
        },
        {
          text: 'Active',
          align: 'start',
          sortable: false,
          value: 'status',
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
    ...mapActions('admin', ['getAllUsers', 'resendInvitation']),
    ...mapMutations('helper', ['setAlert']),
    async fetchUsers() {
      this.loading = true;
      await this.getAllUsers();
      this.loading = false;
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
  },
};
</script>
