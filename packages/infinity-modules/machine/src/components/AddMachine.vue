<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addmachine"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card height="500px">
      <v-card-title class="primary">
        <span class="white--text">
          Create Machine
        </span>
      </v-card-title>

      <v-card-text class="mt-4"> </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!machineObj.name"
          :loading="saving"
          @click="saveMachine"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapState,
  // mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

export default {
  name: 'AddMachinePositionDialog',
  data() {
    return {
      machineObj: {
        name: null,
        photo: null,
        machinetid: null,
        machinename: null,
        description: null,
      },
      rules: {
        name: [(v) => !!v || 'Name is required'],
        description: [(v) => !!v || 'Badage Code is required'],
      },
      saving: false,
      valid: false,
    };
  },
  computed: {
    ...mapState('machine', ['addMachineDialog']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addMachineDialog;
      },
      set(val) {
        this.setAddMachineDialog(val);
      },
    },
  },
  created() {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('machine', ['setAddMachinePositionDialog', 'setTab']),
    ...mapActions('machine', ['createMachine', 'getRecords']),
    handleLineClick(item) {
      if (item) {
        this.machineObj.lineid = item.id;
        this.machineObj.linename = item.name;
      }
    },
    handleSubClick(item) {
      if (item) {
        this.machineObj.positionid = item.id;
        this.machineObj.positionname = item.name;
      }
    },
    getQuery() {
      let query = '?query=assetId!=-1';
      if (this.lineValue) {
        query += `%26%26lineid==${this.lineValue}`;
      }
      if (this.sublineValue) {
        query += `%26%26sublineid=="${this.sublineValue}"`;
      }
      return query;
    },
    async saveMachinePosition() {
      const { machineObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        machineObj.machineid = this.machineInfo.id;
        machineObj.machinename = this.machineInfo.name;
        const payload = {
          ...machineObj,
          assetid: 0,
        };
        this.saving = true;
        const operator = await this.createMachinePosition(payload);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (operator) {
          await this.getPositionRecords(`?query=machineid=="${this.machineInfo.id}"`);
          Object.keys(this.machineObj).forEach((k) => {
            this.machineObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_STATION_POSITION',
          });
        }
        this.dialog = false;
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
