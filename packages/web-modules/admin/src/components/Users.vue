<template>
  <v-card
    flat
    class="transparent"
  >
    <v-card-text class="pa-0">
      <v-data-table
        :items="mappedUsers"
        item-key="id"
        :loading="loading"
        :headers="headers"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.status="{ item }">
          <v-switch
            v-if="item.status === 'ACTIVE' || item.status === 'INACTIVE'"
            value
            :input-value="item.status === 'ACTIVE'"
          ></v-switch>
          <a
            v-else
            :style="inviteLoading ? 'cursor: default;': ''"
            class="body-2 mt-1"
          >
          <span
            v-if="!inviteLoading"
            @click="resendInvite(item)"
            style="cursor: pointer;"
            v-text="'Resend Invitation'"
          ></span>
          <span
            v-else
            v-text="'Sending...'"
          ></span>
        </a>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
  name: 'Users',
  data() {
    return {
      loading: false,
      inviteLoading: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'fullName',
        },
        {
          text: 'Email',
          align: 'start',
          sortable: false,
          value: 'email',
        },
        {
          text: 'Phone',
          align: 'start',
          sortable: false,
          value: 'phone',
        },
        {
          text: 'Status',
          align: 'start',
          sortable: false,
          value: 'status',
        },
      ],
    };
  },
  computed: {
    ...mapState('admin', ['users']),
    mappedUsers() {
      let users = [];
      if (this.users && this.users.length) {
        users = this.users.map((user) => {
          const fullName = user.firstname ? `${user.firstname} ${user.lastname}` : '';
          return {
            fullName,
            email: user.emailId,
            phone: user.phoneNumber,
            status: user.userState,
          };
        });
      }
      return users;
    },
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
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
