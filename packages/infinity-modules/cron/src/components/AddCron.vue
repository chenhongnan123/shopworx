<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addcron"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title>
        <span>
          {{ $t('cronapp.addtitle') }}
        </span>
      </v-card-title>
      <v-card-text style="height: 200px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            :disabled="saving"
            :rules="rules.name"
            label="Name*"
            prepend-icon="mdi-account-box-outline"
            v-model="cronObj.name"
          ></v-text-field>
          <v-text-field
            prepend-icon="mdi-calendar-clock"
            readonly
            :disabled="saving"
            :rules="rules.corn"
            label="CRON*"
            v-model="cronObj.cron"
            @click="cronDialog = true"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('cronapp.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!cronObj.name && !cronObj.departmentid && !cronObj.positionid && !cronObj.code"
          :loading="saving"
          @click="saveCron"
        >
          {{ $t('cronapp.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog
      v-model="cronDialog"
      persistent
      scrollable
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('cronapp.addtitle') }}
          </span>
        </v-card-title>
        <v-card-text>
          <infinity-cron v-model="cron" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text class="text-none" @click="cronDialog = false">
            {{ $t('cronapp.general.cancel') }}
          </v-btn>
          <v-btn color="primary" class="text-none" @click="confirmCron" :disabled="!cron.result">
            {{ $t('cronapp.general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';
import InfinityCron from '../../../../infinity/src/components/util/InfinityCron.vue';

export default {
  name: 'AddCronDialog',
  components: { InfinityCron },
  data() {
    return {
      cron: {},
      cronObj: {
        name: null,
        cron: null,
      },
      rules: {
        name: [(v) => !!v || 'Name is required'],
        cron: [(v) => !!v || 'Cron Express is required'],
      },
      saving: false,
      valid: false,
      cronDialog: false,
    };
  },
  computed: {
    ...mapState('cron', ['cronList', 'addCronDialog']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addCronDialog;
      },
      set(val) {
        this.setAddCronDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('cron', ['setAddCronDialog']),
    ...mapActions('cron', ['updateCron', 'deleteCron', 'createCron', 'getRecords']),
    async saveCron() {
      const { cronObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        const payload = {
          ...cronObj,
          assetid: 0,
          createdby: this.userName,
          createdtime: new Date().getTime(),
        };
        this.saving = true;
        const cron = await this.createCron(payload);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (cron) {
          this.getRecords();
          Object.keys(this.cronObj).forEach((k) => {
            this.cronObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_CRON',
          });
        }
        this.dialog = false;
      }
    },
    confirmCron() {
      if (this.cron.result) {
        this.cronObj.cron = this.cron.express;
        this.cronDialog = false;
      }
    },
  },
};
</script>
