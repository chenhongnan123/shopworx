<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">
          <span> {{ $t('maintenanceplan.sparepart.addtitle') }} </span>
        </span>
      </v-card-title>
      <v-card-text style="height: 250px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-autocomplete
            clearable
            :label="$t('maintenanceplan.sparepart.sparepart')"
            item-text="sparepartname"
            return-object
            :items="spareparts"
            :disabled="saving"
            :rules="rules.sparepart"
            v-model="selectedSparepart"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.sparepartname"></v-list-item-subtitle>
                <v-list-item-title v-text="'Position: ' + item.machinepositionname" />
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            :disabled="saving"
            :rules="rules.lower"
            :label="$t('maintenanceplan.sparepart.lower')"
            v-model="sparepartObj.lower"
            type="number"
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :rules="rules.upper"
            :label="$t('maintenanceplan.sparepart.upper')"
            v-model="sparepartObj.upper"
            type="number"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          <span> {{ $t('maintenanceplan.general.cancel') }} </span>
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!sparepartObj.lower && !sparepartObj.upper && !sparepartObj.sparepartid"
          :loading="saving"
          @click="saveSparepart"
        >
          <span> {{ $t('maintenanceplan.general.save') }} </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  // mapActions,
  mapState,
  // mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

export default {
  name: 'AddSparepartInPlanning',
  data() {
    return {
      saving: false,
      valid: false,
      selectedSparepart: {},
      sparepartObj: {},
      rules: {
        upper: [(v) => !!v || 'Upper Quantity is required'],
        lower: [(v) => !!v || 'Lower Quantity is required'],
        sparepart: [(v) => !!v || 'Sparepart is required'],
      },
      planInfo: {},
      spareparts: [],
    };
  },
  async created() {
    this.getAssets();
    this.planid = this.$route.params.id;
    if (this.planList.length < 1) {
      await this.getRecords();
    }
    this.planInfo = { ...this.planList.filter((item) => item.planid === this.planid)[0] };
    this.spareparts = await this.getSparepartbindpositionRecords(
      `?query=machineid=="${this.planInfo.machineid}"`,
    );
  },
  computed: {
    ...mapState('plan', ['addSparepartDialog', 'planList', 'assets', 'sparepartList']),
    dialog: {
      get() {
        return this.addSparepartDialog;
      },
      set(val) {
        this.setAddSparepartDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('plan', ['setAddSparepartDialog']),
    ...mapActions('plan', [
      'getRecords',
      'getAssets',
      'createSparepartInPlanning',
      'getSparepartInPlanning',
    ]),
    ...mapActions('machine', ['getSparepartbindpositionRecords']),
    async saveSparepart() {
      // prettier-ignore
      const {
        sparepartObj, selectedSparepart, planInfo, sparepartList,
      } = this;
      if (this.$refs.form.validate()) {
        if (sparepartObj.upper < sparepartObj.lower) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Lower Quantity must be smaller than Upper Quantity !',
          });
          return;
        }
        if (
          sparepartList.filter(
            // prettier-ignore
            (item) => item.sparepartname === selectedSparepart.sparepartname
            && item.machinepositionname === selectedSparepart.machinepositionname,
          ).length > 0
        ) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'Sparepart has already seleted !',
          });
          return;
        }
        const getAssetId = this.assets
          .filter((item) => item.status === 'ACTIVE')
          .reduce((acc, item) => acc + item.id, 0);
        selectedSparepart._id = null;
        const payload = {
          ...selectedSparepart,
          ...sparepartObj,
          planid: planInfo.planid,
          planname: planInfo.name,
          assetid: getAssetId,
        };
        this.saving = true;
        const rst = await this.createSparepartInPlanning(payload);
        this.saving = false;
        if (rst) {
          this.getSparepartInPlanning(`?query=planid=="${planInfo.planid}"`);
          Object.keys(this.sparepartObj).forEach((k) => {
            this.sparepartObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_SPAREPART_FOR_MAINTENANCE_PLAN',
          });
        }
        this.dialog = false;
      }
    },
  },
};
</script>
