<template>
  <div>
    <validation-observer #default="{ passes }">
      <v-form @submit.prevent="passes(save)">
        <v-card
          flat
          :key="index"
          class="mb-2 transparent"
          v-for="(user, index) in users"
        >
          <v-row>
            <v-col cols="5" class="py-0">
              <identifier-input
                :loading="loading"
                v-model="user.identifier"
                :id="`identifier-${index}`"
                @on-update="setIdentifier($event, index)"
              />
            </v-col>
            <v-col cols="4" class="py-0">
              <validation-provider
                name="Role"
                rules="required"
                #default="{ errors }"
              >
                <v-select
                  :items="roles"
                  item-value="roleId"
                  hide-details="auto"
                  :disabled="loading"
                  :id="`role-${index}`"
                  v-model="user.roleId"
                  :error-messages="errors"
                  item-text="roleDescription"
                  :label="$t('setup.inviteUsers.role')"
                ></v-select>
              </validation-provider>
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
        </v-card>
        <v-btn
          block
          rounded
          type="submit"
          color="primary"
          id="inviteUsers"
          class="text-none"
          :loading="loading"
        >
          <v-icon
            left
            v-text="'$invite'"
          ></v-icon>
            {{ $t('setup.inviteUsers.invite') }}
        </v-btn>
        <div class="text-center">
          <span>{{ $t('helper.or') }}</span>
        </div>
        <div class="text-center">
          <v-btn
            text
            @click="skip"
            color="primary"
            id="skipInvite"
            class="text-none"
            :disabled="loading"
          >
            {{ $t('helper.skip') }}
          </v-btn>
        </div>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import IdentifierInput from '@/components/auth/IdentifierInput.vue';

export default {
  name: 'InviteUsers',
  components: {
    IdentifierInput,
  },
  data() {
    return {
      users: [],
      loading: false,
    };
  },
  computed: {
    ...mapState('user', ['activeSite', 'roles', 'me']),
  },
  async created() {
    if (!this.me) {
      await this.getMe();
    }
    this.addUser();
    await this.getUserRoles();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('user', ['inviteUsers', 'getUserRoles', 'getMe']),
    setIdentifier({ isMobile, prefix }, index) {
      this.users[index].isMobile = isMobile;
      this.users[index].prefix = prefix;
    },
    addUser() {
      this.users.push({
        identifier: '',
        roleId: '',
        isMobile: false,
        prefix: '',
      });
    },
    removeUser(index) {
      this.users.splice(index, 1);
    },
    skip() {
      this.$emit('update-step');
    },
    async save() {
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
        const createdUsers = addedUsers.filter((u) => u.created).length;
        if (createdUsers && createdUsers.length) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'INVITE_SENT',
          });
        }
        if (addedUsers.some((user) => !user.created)) {
          const usersNotAdded = addedUsers
            .filter((user) => !user.created)
            .map((u) => u.identifier)
            .slice();
          this.users = this.users
            .filter((user) => usersNotAdded.includes(user.identifier))
            .map((user) => {
              const currentUser = addedUsers.find((u) => u.identifier === user.identifier);
              const message = JSON.parse(currentUser.message);
              return {
                ...user,
                showError: true,
                error: message.errorCode,
              };
            });
        } else {
          this.users = [{
            identifier: null,
            roleId: null,
            siteId: this.activeSite,
          }];
          this.skip();
        }
      }
      this.loading = false;
    },
  },
};
</script>
