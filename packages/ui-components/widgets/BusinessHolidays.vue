<template>
  <v-card
    flat
    height="100%"
    rounded="lg"
  >
    <v-card-title>
      Business holidays
      <v-spacer></v-spacer>
      <invite-users @invited="onInvited" />
    </v-card-title>
    <v-card-text>
      <v-data-table
        item-key="id"
        class="transparent"
        disable-pagination
        :items="pendingUsers"
        hide-default-footer
        :headers="pendingHeaders"
      >
        <template #no-data>
          No pending invites
        </template>
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
  </v-card>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import InviteUsers from './InviteUsers.vue';
import DeleteUser from './DeleteUser.vue';

export default {
  name: 'BusinessHolidays',
  components: {
    InviteUsers,
    DeleteUser,
  },
  data() {
    return {
      loading: false,
      inviteLoading: false,
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
  },
};
</script>
