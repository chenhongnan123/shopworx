<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on }">
      <v-btn
        small
        v-on="on"
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
    </template>
    <v-form @submit.prevent="onSubmit" ref="form" v-model="isValid">
    <v-card>
      <v-card-title primary-title>
        <span>
          Invite users
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-if="invitedUsers && invitedUsers.length">
          <template v-for="(user, index) in invitedUsers">
            <v-col cols="12" :key="index">
              <span>{{ user.identifier }}</span>
              <span class="mx-2">|</span>
              <span>
                {{ $t('setup.inviteUsers.invited') }}
                <v-icon
                  color="success"
                  v-text="'$tick'"
                ></v-icon>
              </span>
            </v-col>
          </template>
        </v-row>
          <v-row
            :key="index"
            v-for="(user, index) in users"
          >
            <v-col cols="6" class="py-0">
              <identifier-input
                :loading="loading"
                v-model="user.identifier"
                :id="`identifier-${index}`"
                @on-update="setIdentifier($event, index)"
                :error="user.error"
              />
            </v-col>
            <v-col cols="3" class="py-0">
              <v-select
                :items="roles"
                :rules="[v => !!v || 'Role is required']"
                item-value="roleId"
                hide-details="auto"
                :disabled="loading"
                :id="`role-${index}`"
                v-model="user.roleId"
                error-messages=""
                item-text="roleDescription"
                :label="$t('setup.inviteUsers.role')"
              ></v-select>
            </v-col>
            <v-col cols="3" class="my-auto">
              <v-btn
                icon
                small
                class="mx-2"
                @click="addUser"
                :id="`add-${index}`"
              >
                <v-icon v-text="'$add'"></v-icon>
              </v-btn>
              <v-btn
                icon
                small
                class="pa-0"
                :id="`remove-${index}`"
                @click="removeUser(index)"
                :disabled="users.length === 1"
              >
                <v-icon v-text="'$remove'"></v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          type="submit"
          color="primary"
          id="inviteUsers"
          class="text-none mb-2 mr-3"
          :loading="loading"
          :disabled="!isValid"
        >
            Invite
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import IdentifierInput from '@/components/auth/IdentifierInput.vue';

export default {
  name: 'InviteUsers',
  components: {
    IdentifierInput,
  },
  data() {
    return {
      dialog: false,
      loading: false,
      users: [],
      invitedUsers: [],
      isValid: false,
    };
  },
  computed: {
    ...mapState('user', ['activeSite', 'roles']),
  },
  created() {
    this.addUser();
  },
  methods: {
    ...mapActions('user', ['inviteUsers']),
    setIdentifier({ isMobile, prefix }, index) {
      this.users[index].isMobile = isMobile;
      this.users[index].prefix = prefix;
      delete this.users[index].error;
    },
    addUser() {
      this.users.push({
        identifier: '',
        roleId: '',
        siteId: '',
        isMobile: false,
        prefix: '',
      });
    },
    removeUser(index) {
      this.users.splice(index, 1);
    },
    async onSubmit() {
      this.loading = true;
      const payload = this.users.map((user) => ({
        identifier: user.isMobile
          ? `${user.prefix}${user.identifier}`
          : user.identifier,
        roleId: user.roleId,
        siteId: this.activeSite,
      }));
      const addedUsers = await this.inviteUsers(payload);
      if (addedUsers && addedUsers.length) {
        this.invitedUsers = addedUsers.filter((u) => u.created);
        if (addedUsers.some((user) => !user.created)) {
          const usersNotAdded = addedUsers
            .filter((user) => !user.created)
            .map((u) => u.identifier);
          this.users = this.users
            .filter((user) => usersNotAdded.includes(user.isMobile
              ? `${user.prefix}${user.identifier}`
              : user.identifier))
            .map((user) => {
              const currentUser = addedUsers.find((u) => u.identifier === (user.isMobile
                ? `${user.prefix}${user.identifier}`
                : user.identifier));
              const message = JSON.parse(currentUser.message);
              // this.$refs.form.setErrors({
              //   identifier: [this.$i18n.t(`error.${message.errorCode}`)],
              // });
              return {
                ...user,
                error: this.$i18n.t(`error.${message.errorCode}`),
              };
            });
        } else {
          this.users = [];
          this.addUser();
          this.success = true;
          this.$emit('invited');
          this.$refs.form.reset();
        }
      }
      this.loading = false;
    },
    closeDialog() {
      this.dialog = false;
      this.users = [];
      this.invitedUsers = [];
      this.addUser();
      this.$refs.form.reset();
    },
  },
};
</script>
