<template>
  <div>
    <v-form @submit.prevent="onSubmit">
      <v-card-text>
        <perfect-scrollbar style="max-height: 330px" :options="{ suppressScrollX: true }">
          <v-row v-for="(user, index) in users" :key="index">
            <v-col cols="12" sm="6">
              <v-text-field
                outlined
                :error="user.showError"
                @input="user.showError = false"
                v-model="user.identifier"
                label="Mobile number or email"
                :error-messages="user.showError
                  ? $t(`infinity.error.${user.error}`)
                  : ''"
              ></v-text-field>
            </v-col>
            <v-col cols="9" sm="3">
              <v-select
                v-model="user.roleId"
                outlined
                hide-details
                :items="roles"
                item-text="roleDescription"
                item-value="roleId"
                label="Role"
              ></v-select>
            </v-col>
            <v-col cols="3" sm="3">
              <v-btn icon class="mt-2" @click="addUser">
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
              <v-btn icon class="mt-2" @click="removeUser(index)" :disabled="users.length === 1">
                <v-icon>mdi-minus-circle-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </perfect-scrollbar>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          Invite users
        </v-btn>
        <v-btn
          text
          @click="skip"
          color="primary"
          class="text-none"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          Skip for now
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'InviteUsers',
  data() {
    return {
      loading: false,
      users: [],
    };
  },
  async created() {
    this.addUser();
    try {
      const data = await this.getUserRoles();
      if (data && data.errors) {
        this.$root.$snackbar.error(data.errors);
      }
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    ...mapState('user', ['activeSite', 'roles']),
  },
  methods: {
    ...mapActions('user', ['inviteUsers', 'getUserRoles']),
    addUser() {
      this.users.push({
        identifier: null,
        roleId: null,
        siteId: this.activeSite,
        showError: false,
      });
    },
    removeUser(index) {
      this.users.splice(index, 1);
    },
    skip() {
      this.$router.push({ name: 'onboarding' });
    },
    async onSubmit() {
      this.loading = true;
      try {
        const payload = this.users.map((user) => ({
          identifier: user.identifier,
          roleId: user.roleId,
          siteId: user.siteId,
        }));
        const data = await this.inviteUsers(payload);
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          const addedUsers = data;
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
            this.$emit('success');
          }
        }
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    },
  },
};
</script>
