<template>
  <div>
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
    <validation-observer ref="form" #default="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(onSubmit)" v-model="isValid">
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
                :error="user.error"
              />
            </v-col>
            <v-col cols="4" class="py-0">
              <validation-provider
                name="role"
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
          :disabled="!isValid"
        >
          <v-icon
            left
            :v-text="success ? '$forward' : '$invite'"
          ></v-icon>
            {{ success
              ? $t('setup.inviteUsers.continue')
              : $t('setup.inviteUsers.invite')
            }}
        </v-btn>
        <template v-if="!success">
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
        </template>
      </v-form>
    </validation-observer>
  </div>
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
      users: [],
      invitedUsers: [],
      loading: false,
      success: false,
      isValid: false,
    };
  },
  computed: {
    ...mapState('user', ['activeSite', 'roles']),
  },
  async created() {
    this.addUser();
    await this.getUserRoles();
  },
  methods: {
    ...mapActions('user', ['inviteUsers', 'getUserRoles']),
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
              this.$refs.form.setErrors({
                identifier: [this.$i18n.t(`error.${message.errorCode}`)],
              });
              return {
                ...user,
                error: this.$i18n.t(`error.${message.errorCode}`),
              };
            });
        } else {
          this.users = [];
          this.success = true;
        }
      }
      this.loading = false;
    },
    onSubmit() {
      if (this.success) {
        this.skip();
      } else {
        this.save();
      }
    },
  },
};
</script>
