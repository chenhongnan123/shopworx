<template>
  <v-container fluid class="py-0" style="height: 100%;">
    <div class="stick">
      <div style="float: right">
        <v-btn small color="primary" class="text-none" @click="adddialog = true">
          <v-icon small left>mdi-plus</v-icon>
          {{ $t('operator.general.add') }}
        </v-btn>
        <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
          <v-icon small left>mdi-refresh</v-icon>
          {{ $t('operator.general.refresh') }}
        </v-btn>
        <v-btn
          small
          color="error"
          outlined
          class="text-none ml-2"
          v-if="departmentList.length && departmentSelected.length"
          @click="confirmDialog = true"
        >
          <v-icon small left>mdi-delete</v-icon>
          {{ $t('operator.general.delete') }}
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="departmentList"
      class="elevation-3"
      id="departmenttable"
      :options="{ itemsPerPage: 10 }"
      show-select
      v-model="departmentSelected"
    >
    </v-data-table>
    <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
      <v-card>
        <v-card-title primary-title>
          <span> {{ $t('operator.general.confirmheader') }} </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="confirmDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text> {{ $t('operator.general.confirmmessage') }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            @click="handleDeleteDepartment"
          >
            {{ $t('operator.general.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      id="adddepartment"
      v-model="adddialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          <span>
            {{ $t('operator.settings.adddepartment') }}
          </span>
        </v-card-title>
        <v-card-text style="height: 100px;">
          <v-form ref="form" lazy-validation>
            <v-text-field
              :disabled="saving"
              :rules="rules.name"
              :label="$t('operator.addDialog.name')"
              prepend-icon="mdi-account-box-outline"
              v-model="departmentObj.name"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text class="text-none" @click="adddialog = false">
            {{ $t('operator.general.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            class="text-none"
            :disabled="!departmentObj.name"
            :loading="saving"
            @click="saveDepartment"
          >
            {{ $t('operator.general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'DepartmentMaster',
  data() {
    return {
      adddialog: false,
      confirmDialog: false,
      departmentObj: {},
      departmentSelected: [],
      items: [],
      saving: false,
      headers: [
        { text: this.$t('operator.settings.id'), value: 'id', width: 80 },
        { text: this.$t('operator.settings.name'), value: 'name' },
      ],
      rules: {
        name: [(v) => !!v || 'Name is required'],
      },
    };
  },
  async created() {
    await this.getDepartments();
  },
  computed: {
    ...mapState('operator', ['departmentList']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('operator', ['updateRecord', 'deleteRecord', 'createRecord', 'getDepartments']),
    async handleDeleteDepartment() {
      // eslint-disable-next-line max-len
      const results = await Promise.all(
        // prettier-ignore
        this.departmentSelected.map((department) => this.deleteRecord({ element: 'department', id: department.id })),
      );
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        await this.getDepartments();
        this.saving = false;
        this.confirmDialog = false;
        this.departmentSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete_department',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'delete_department',
        });
      }
    },
    async RefreshUI() {
      await this.getDepartments();
    },
    async saveDepartment() {
      const { departmentObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        const payload = {
          ...departmentObj,
          assetid: 0,
          createdby: this.userName,
          createdtime: new Date().getTime(),
        };
        const postdata = {
          element: 'department',
          payload,
        };
        this.saving = true;
        const department = await this.createRecord(postdata);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (department) {
          this.getDepartments();
          Object.keys(this.departmentObj).forEach((k) => {
            this.departmentObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_DEPARTMENT',
          });
        }
        this.adddialog = false;
      }
    },
  },
};
</script>
<style lang="sass">
.stick
    width: 100%
    padding: 10px 0
    overflow: hidden
    z-index: 1
</style>
