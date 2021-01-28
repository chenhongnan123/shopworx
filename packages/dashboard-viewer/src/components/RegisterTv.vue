<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-none ml-5"
      >
        <v-icon left small>mdi-plus</v-icon>
        Register new TV
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="title font-weight-regular justify-space-between">
        Register new TV
      </v-card-title>
      <v-form ref="form" v-model="isValid" @submit.prevent="registerTV">
        <v-card-text>
          <v-text-field
            dense
            outlined
            v-model="devicename"
            label="TV name"
            prepend-icon="mdi-television"
            :disabled="saving"
            :rules="[(v) => !!v || 'TV name is required']"
          ></v-text-field>
          <v-text-field
            dense
            outlined
            v-model="deviceid"
            class="ml-8"
            label="Device ID*"
            :disabled="saving"
            :rules="[(v) => !!v || 'Device ID is required']"
          ></v-text-field>
          <div class="caption">*Steps to find device ID</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text :disabled="saving" class="text-none" @click="cancel">
            Exit
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary"
            class="text-none"
            :loading="saving"
            :disabled="!isValid"
          >
            Register
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegisterTv',
  data() {
    return {
      devicename: '',
      deviceid: '',
      isValid: false,
      saving: false,
      dialog: false,
    };
  },
  methods: {
    ...mapActions('dashboard', ['createTV']),
    clear() {
      this.devicename = '';
      this.deviceid = '';
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.dialog = false;
    },
    async registerTV() {
      if (this.isValid) {
        this.saving = true;
        const payload = {
          deviceid: this.deviceid,
          devicename: this.devicename,
          devicetype: 'TV',
          status: 'REGISTER',
        };
        const created = this.createTV(payload);
        if (created) {
          this.$emit('on-register');
          this.cancel();
        }
        this.saving = false;
      }
    },
  },
};
</script>
