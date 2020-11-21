<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        color="error"
        v-bind="attrs"
        :loading="deleting"
        @click="removeUser"
      >
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </template>
    <span>Delete user</span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

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
