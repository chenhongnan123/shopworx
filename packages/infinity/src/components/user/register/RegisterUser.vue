<template>
  <div>
    <v-skeleton-loader
      type="paragraph@4, button@1"
      v-if="fetching"
    ></v-skeleton-loader>
    <v-form @submit.prevent="onSubmit" v-else>
      <v-card-text>
        <v-window v-model="step">
          <v-window-item :value="1">
            <register-user-details-form ref="userDetails"/>
          </v-window-item>
          <v-window-item :value="2">
            <register-username-form ref="username" />
          </v-window-item>
          <v-window-item :value="3">
            <register-password-form ref="password" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          {{ step != 3
            ? $t('infinity.user.register.form.buttons.next')
            : $t('infinity.user.register.form.buttons.complete')
          }}
        </v-btn>
        <v-btn
          v-if="step != 1"
          text
          color="primary"
          class="text-none"
          @click="step -= 1"
          v-text="$t('infinity.user.register.form.buttons.back')"
        >
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import RegisterUserDetailsForm from '@/components/user/register/RegisterUserDetailsForm.vue';
import RegisterUsernameForm from '@/components/user/register/RegisterUsernameForm.vue';
import RegisterPasswordForm from '@/components/user/register/RegisterPasswordForm.vue';

export default {
  name: 'RegisterUser',
  components: {
    RegisterUserDetailsForm,
    RegisterUsernameForm,
    RegisterPasswordForm,
  },
  data() {
    return {
      step: 1,
      fetching: null,
      loading: null,
    };
  },
  computed: {
    ...mapState('user', ['me']),
  },
  async created() {
    if (!this.me) {
      this.fetching = true;
      try {
        const data = await this.getMe();
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        }
      } catch (e) {
        console.error(e);
      }
      this.fetching = false;
    }
  },
  methods: {
    ...mapActions('user', ['getMe']),
    async onSubmit() {
      this.loading = true;
      if (this.step === 1) {
        const userDetailsUpdated = await this.$refs.userDetails.update();
        if (userDetailsUpdated) {
          this.step = 2;
        }
      } else if (this.step === 2) {
        const usernameUpdated = await this.$refs.username.update();
        if (usernameUpdated) {
          this.step = 3;
        }
      } else {
        const passwordUpdated = await this.$refs.password.update();
        if (passwordUpdated) {
          this.$emit('success', true);
        }
      }
      this.loading = false;
    },
  },
};
</script>
