<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addoperator"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title>
        <span>
          {{ $t('operator.addDialog.title') }}
        </span>
      </v-card-title>
      <img
        v-if="operatorObj.photo"
        :src="operatorObj.photo ? operatorObj.photo : ''"
        style="margin: 0 auto;background-color: gray;cursor: pointer;height: 200px;"
        @click="fireUpload"
      />
      <div v-else @click="fireUpload" id="clicktoupload">
        <v-icon x-large color="#00bcd4">mdi-account-plus</v-icon>
      </div>
      <v-card-text style="height: 800px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-file-input
            :disabled="saving"
            :label="$t('operator.addDialog.name')"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-portrait"
            style="display: none;"
            ref="upload"
            id="photo"
            @change="uploaded"
          ></v-file-input>
          <v-text-field
            :disabled="saving"
            :rules="rules.id"
            :label="$t('operator.addDialog.id')"
            prepend-icon="mdi-account-box-outline"
            v-model="operatorObj.id"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :rules="rules.name"
            :label="$t('operator.addDialog.name')"
            prepend-icon="mdi-account-box-outline"
            v-model="operatorObj.operatorname"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :rules="rules.code"
            :label="$t('operator.addDialog.code')"
            prepend-icon="mdi-badge-account-horizontal-outline"
            v-model="operatorObj.operatorcode"
          ></v-text-field>
          <v-text-field
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :disabled="saving"
            :rules="rules.password"
            :label="$t('operator.addDialog.password')"
            prepend-icon="mdi-lock-outline"
            v-model="operatorObj.password"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            autocomplete="new-password"
          ></v-text-field>
          <!-- <v-autocomplete
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
          </v-autocomplete> -->
          <v-autocomplete
            clearable
            :label="$t('operator.addDialog.position')"
            :items="positionList"
            return-object
            :disabled="saving"
            item-text="name"
            prepend-icon="mdi-account-tie-outline"
            @change="handlePositionClick"
            :rules="rules.position"
            ref="position"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.departmentname"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('operator.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="
            !operatorObj.name &&
              !operatorObj.departmentid &&
              !operatorObj.positionid &&
              !operatorObj.code
          "
          :loading="saving"
          @click="saveOperator"
        >
          {{ $t('operator.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';

export default {
  name: 'AddOperatorDialog',
  data() {
    return {
      show: false,
      operatorObj: {
        id: null,
        name: null,
        photo: null,
        departmentid: null,
        departmentname: null,
        positionid: null,
        positionname: null,
        code: null,
        password: null,
      },
      rules: {
        id: [(v) => !!v || 'ID is required'],
        name: [(v) => !!v || 'Name is required'],
        department: [(v) => !!v || 'Department is required'],
        position: [(v) => !!v || 'Position is required'],
        code: [(v) => !!v || 'Badage Code is required'],
      },
      saving: false,
      valid: false,
    };
  },
  computed: {
    ...mapState('operator', [
      'filter',
      'departmentList',
      'positionList',
      'operatorList',
      'departmentValue',
      'positionValue',
      'addOperatorDialog',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addOperatorDialog;
      },
      set(val) {
        this.setAddOperatorDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('operator', ['setAddOperatorDialog']),
    ...mapActions('operator', [
      'updateOperator',
      'deleteOperator',
      'createOperator',
      'createOperatorList',
      'getDepartments',
      'getPositions',
      'getRecords',
    ]),
    fireUpload() {
      document.querySelector('#photo').click();
    },
    uploaded(e) {
      const that = this;
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = (event) => {
        console.log(event);
        that.operatorObj.photo = event.target.result;
      };
    },
    handleDepartmentClick(item) {
      if (item) {
        this.operatorObj.departmentid = item.id;
        this.operatorObj.departmentname = item.name;
      }
    },
    handlePositionClick(item) {
      if (item) {
        this.operatorObj.positionid = item.id;
        this.operatorObj.positionname = item.name;
        this.operatorObj.departmentid = item.departmentid;
        this.operatorObj.departmentname = item.departmentname;
      }
    },
    getQuery() {
      let query = '?query=';
      if (this.position) {
        query += `positionid=="${this.position}"%26%26`;
      }
      if (this.department) {
        query += `departmentid=="${this.department}"%26%26`;
      }
      return query;
    },
    async saveOperator() {
      const { operatorObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        if (this.operatorList.some((operator) => operatorObj.code === operator.code)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Operator Badage Code is present',
          });
          return;
        }
        // prettier-ignore
        // eslint-disable-next-line max-len
        if (this.operatorList.some((operator) => operatorObj.id === operator.id)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Operator ID is present',
          });
          return;
        }
        const payload = {
          ...operatorObj,
          assetid: 0,
          createdby: this.userName,
          createdtime: new Date().getTime(),
        };
        this.saving = true;
        const operator = await this.createOperator(payload);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (operator) {
          this.getRecords(this.getQuery());
          Object.keys(this.operatorObj).forEach((k) => {
            this.operatorObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_STAFF',
          });
        }
        this.dialog = false;
        // this.$refs.department.reset();
        this.$refs.position.reset();
      }
    },
  },
};
</script>
<style lang="sass">
#clicktoupload
  margin: 0 auto
  border: 2px dashed #00bcd4
  cursor: pointer
  height: 200px
  width: 200px
  line-height: 200px
  text-align: center
</style>
