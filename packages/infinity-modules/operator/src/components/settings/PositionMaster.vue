<template>
  <v-container fluid class="py-0" style="height: 100%;">
    <v-card-title primary-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="$t('operator.general.search')"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn small color="primary" class="text-none mt-4" @click="adddialog = true">
        <v-icon small left>mdi-plus</v-icon>
        {{ $t('operator.general.add') }}
      </v-btn>
      <v-btn small color="primary" outlined class="text-none ml-2 mt-4" @click="RefreshUI">
        <v-icon small left>mdi-refresh</v-icon>
        {{ $t('operator.general.refresh') }}
      </v-btn>
      <v-btn
        small
        color="green"
        outlined
        class="text-none ml-2 mt-4"
        v-if="positionList.length && positionSelected.length == 1"
        @click="
          setAuthDialog(true);
          setSelectedPosition(positionSelected[0]);
        "
      >
        <v-icon small left>mdi-account-key-outline</v-icon>
        {{ $t('operator.settings.auth') }}
      </v-btn>
      <v-btn
        small
        color="error"
        outlined
        class="text-none ml-2 mt-4"
        v-if="positionList.length && positionSelected.length"
        @click="confirmDialog = true"
      >
        <v-icon small left>mdi-delete</v-icon>
        {{ $t('operator.general.delete') }}
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="positionList"
      class="elevation-3"
      id="positiontable"
      :options="{ itemsPerPage: 10 }"
      show-select
      v-model="positionSelected"
      :search="search"
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
          <v-btn color="primary" class="text-none" :loading="saving" @click="handleDeletePosition">
            {{ $t('operator.general.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      id="addposition"
      v-model="adddialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>
          <span>
            {{ $t('operator.settings.addposition') }}
          </span>
        </v-card-title>
        <v-card-text style="height: 160px;">
          <v-form ref="form" lazy-validation>
            <v-autocomplete
              clearable
              :label="$t('operator.addDialog.department')"
              :items="departmentList"
              return-object
              :disabled="saving"
              item-text="name"
              prepend-icon="mdi-account-supervisor-circle-outline"
              @change="handleDepartmentClick"
              :rules="rules.department"
              ref="department"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-text-field
              :disabled="saving"
              :rules="rules.name"
              :label="$t('operator.addDialog.name')"
              prepend-icon="mdi-account-box-outline"
              v-model="positionObj.name"
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
            :disabled="!positionObj.name"
            :loading="saving"
            @click="savePosition"
          >
            {{ $t('operator.general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <auth-master />
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import AuthMaster from './position/AuthMaster.vue';

export default {
  components: { AuthMaster },
  name: 'PositionMaster',
  data() {
    return {
      adddialog: false,
      confirmDialog: false,
      positionObj: {},
      positionSelected: [],
      items: [],
      saving: false,
      search: null,
      headers: [
        { text: this.$t('operator.settings.id'), value: 'id', width: 80 },
        { text: this.$t('operator.settings.name'), value: 'name' },
        { text: this.$t('operator.settings.department'), value: 'departmentname' },
      ],
      rules: {
        name: [(v) => !!v || 'Name is required'],
        department: [(v) => !!v || 'Department is required'],
      },
    };
  },
  async created() {
    await this.getDepartments();
    await this.getPositions();
    await this.getAuthCodes();
  },
  computed: {
    ...mapState('operator', ['positionList', 'departmentList']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('operator', ['setAuthDialog', 'setSelectedPosition']),
    ...mapActions('operator', [
      'updateRecord',
      'deleteRecord',
      'createRecord',
      'getPositions',
      'getAuthCodes',
      'getDepartments',
    ]),
    handleDepartmentClick(item) {
      if (item) {
        this.positionObj.departmentid = item.id;
        this.positionObj.departmentname = item.name;
      }
    },
    async handleDeletePosition() {
      // eslint-disable-next-line max-len
      const results = await Promise.all(
        // prettier-ignore
        this.positionSelected.map((position) => this.deleteRecord({ element: 'position', id: position.id })),
      );
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        await this.getPositions();
        this.saving = false;
        this.confirmDialog = false;
        this.positionSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete_position',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'delete_position',
        });
      }
    },
    async RefreshUI() {
      await this.getPositions();
    },
    async savePosition() {
      const { positionObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        const payload = {
          ...positionObj,
          assetid: 0,
          createdby: this.userName,
          createdtime: new Date().getTime(),
        };
        const postdata = {
          element: 'position',
          payload,
        };
        this.saving = true;
        const position = await this.createRecord(postdata);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (position) {
          this.getPositions();
          Object.keys(this.positionObj).forEach((k) => {
            this.positionObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_POSITION',
          });
        }
        this.adddialog = false;
        this.$refs.department.reset();
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
