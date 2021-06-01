<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        color="error"
        v-bind="attrs"
        :loading="deleting"
        :disabled="user.id === myId"
        @click="removeUser"
      >
        <v-icon v-text="'$delete'"></v-icon>
      </v-btn>
    </template>
    <span>Delete user</span>
  </v-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'DeleteModel',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleting: false,
    };
  },
  computed: {
    ...mapState('user', ['me']),
    myId() {
      return this.me && this.me.user.id;
    },
  },
  methods: {
    ...mapActions('admin', ['updateUser']),
    async removeUser() {
      if (await this.$root.$confirm.open(
        'Delete user',
        `Are you sure want to delete "${this.user.email || this.user.phone}"?`,
      )) {
        this.deleting = true;
        const payload = {
          userId: this.user.id,
          userState: 'INACTIVE',
        };
        this.updateUser(payload);
        this.deleting = false;
      }
    },
  },
};
</script>
