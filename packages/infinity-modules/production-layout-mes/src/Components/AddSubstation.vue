 <template>
<v-dialog
 persistent
 v-model="dialog"
 transition="dialog-transition"
 max-width="600px">
    <template #activator="{ on }">
    <v-icon v-on="on" v-text="'$plus'"
    class="float-right"></v-icon>
    </template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Add Substation</span>
         <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
        <v-select
              label="Select Station *"
              :items="stationsbylines"
              item-text="name"
              return-object
              v-model="selectedSubstationLine"
              @click="getfilteredStations"
            >
            </v-select>
        <v-text-field label="Name *"
        hint="For example, SST-01"
        v-model="newSubstation.name"
        :rules ="nameRules"
        counter="15"
         required></v-text-field>
         <v-text-field label="Number *" type="number"
         hint="For example, 1111"
         v-model="newSubstation.numbers"
         :rules ="numberRules"
         counter="10"
          required></v-text-field>
          <v-text-field label="Serial Number *" type="number"
         hint="For example, 1,2,3,4"
         v-model="newSubstation.serialnumber"
         :rules ="numberRules"
         counter="10"
          required></v-text-field>
        <v-text-field label="Description"
         hint="For example, added by Manager"
         type="text" v-model="newSubstation.description"></v-text-field>
           <v-textarea
        dense
        rows="3"
        outlined
        single-line
        v-model="newSubstation.jsondata"
        label="Paste JSON here"
        :rules="configRules"
      ></v-textarea>
        <v-switch
         v-model="newSubstation.serverlive"
         label="Server Live value"
        ></v-switch>
         <v-switch
        v-model="newSubstation.initialsubstation"
        label="Initial Sub Station"
        :disabled="btnInitdisable"
        ></v-switch>
        <v-switch
        v-model="newSubstation.finalsubstation"
        label="Final Sub Station"
        :disabled="btnFindisable"
        ></v-switch>
        <v-checkbox v-model="checkedReal" class="mx-2"
         label="Record Process parameters"></v-checkbox>
        <v-checkbox v-model="checked" class="mx-2"
         label="Record Production parameters (Optional)"></v-checkbox>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
        class="text-none"
        :disabled="!valid"
         @click="saveSubstation">Save</v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      newSubstation: {},
      assetId: null,
      checked: false,
      checkedReal: false,
      selectedSubstationLine: null,
      default: false,
      dialog: false,
      btnInitdisable: false,
      btnFindisable: false,
      valid: true,
      name: '',
      numbers: '',
      configRules: [
        (v) => !!v || 'Configuration is required.',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration.',
      ],
      numberRules: [(v) => (v && v.length) > 0 || 'number required',
        (v) => (v && v.length <= 10) || 'Number must be less than 10 characters'],
      nameRules: [(v) => !!v || 'Name required',
        (v) => (v && v.length <= 15) || 'Name must be less than 10 characters',
        (v) => /^\S+$/.test(v) || 'Space not allowed'],
    };
  },
  props: {
    lineid: {
      type: [Number, String],
      required: true,
    },
  },
  created() {
    this.newSubstation = { ...this.substation };
    this.getAssets();
  },
  computed: {
    ...mapState('productionLayoutMes', ['selectedLine', 'stationsbylines', 'sublines', 'allStations', 'stations', 'subStations', 'assets']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutMes', ['createSubstation', 'getStationbyline', 'createElement', 'getSubStationName', 'getAssets']),
    compareValues(val) {
      if (val.initialsubstation === true) {
        this.btnFindisable = true;
      } else {
        this.btnFindisable = false;
      }
      if (val.finalsubstation === true) {
        this.btnInitdisable = true;
      } else {
        this.btnInitdisable = false;
      }
    },
    isValidJsonString(jsonString) {
      if (!(jsonString && typeof jsonString === 'string')) {
        return false;
      }
      try {
        JSON.parse(jsonString);
        return true;
      } catch (error) {
        return false;
      }
    },
    async getfilteredStations() {
      this.getStationbyline(`?query=lineid==${this.selectedLine.id}`);
    },
    async saveSubstation() {
      if (this.newSubstation.numbers === undefined) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NUMBER_REQUIRED',
        });
      } else {
        this.$refs.form.validate();
        const initialSubstationFlag = this.subStations
          .filter((item) => item.sublineid === this.selectedSubstationLine.sublineid
          && item.initialsubstation === true
          && item.initialsubstation === this.newSubstation.initialsubstation);
        const finalSubstationFlag = this.subStations
          .filter((item) => item.sublineid === this.selectedSubstationLine.sublineid
          && item.finalsubstation === true
          && item.finalsubstation === this.newSubstation.finalsubstation);
        const substationNumberFlag = this.subStations
          .filter((o) => o.numbers === parseInt(this.newSubstation.numbers, 10));
        const substationNameFlag = this.subStations
          .filter((o) => o.name.toLowerCase().split(' ').join('') === this.newSubstation.name.toLowerCase().split(' ').join(''));
        if (substationNumberFlag.length > 0) {
          this.newSubstation.numbers = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_NO',
          });
        } else if (initialSubstationFlag.length > 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_INITIAL_SUBSTATION',
          });
        } else if (finalSubstationFlag.length > 0) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST_FINAL_SUBSTATION',
          });
        } else if (substationNameFlag.length > 0) {
          this.newSubstation.name = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST',
          });
        } else {
          this.saving = true;
          const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
          this.assetId = getAssetId;
          this.newSubstation = {
            ...this.newSubstation,
            stationid: this.selectedSubstationLine.id,
            sublineid: this.selectedSubstationLine.sublineid,
            ismainline: this.sublines.filter(
              (f) => f.id === this.selectedSubstationLine.sublineid,
            )[0].ismainline,
            lineid: this.selectedSubstationLine.lineid,
            paramconfigured: this.checked,
            realparamconfigured: this.checkedReal,
            assetid: this.assetId,
          };
          let created = false;
          const payload = this.newSubstation;
          created = await this.createSubstation(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'SUB-STATION_CREATED',
            });
            const realParam = this.checkedReal;
            const substationid = this.subStations[0].id;
            if (realParam) {
              this.assetId = this.getAssetId;
              const object = {
                customerId: 195,
                siteId: 197,
                categoryType: 'ASSET',
                collectionName: 'process',
                elementName: `process_${substationid}`,
                elementDescription: `Process_${substationid}`,
                status: 'ACTIVE',
                elementType: 'PROVISIONING',
                uniqueTagName: '',
                uniqueTagValue: 0,
                uniqueTagStartValue: 0,
                uniqueTagValuePrefix: '',
                uniqueTagValueSuffix: '',
                businessTimeTagsRequired: false,
                optional: false,
                assetBased: true,
                uniqueTag: false,
              };
              let createdElement = false;
              createdElement = await this.createElement(object);
              if (createdElement) {
                this.setAlert({
                  show: true,
                  type: 'success',
                  message: 'SUB-STATION_CREATED_PROCESS_PARAMETERS',
                });
              }
            }
            const checkedPlc = this.checked;
            if (checkedPlc) {
              this.newSubstation = {};
              this.assetId = this.getAssetId;
              // const substationid = this.subStations[0].id;
              const object = {
                customerId: 195,
                siteId: 197,
                categoryType: 'ASSET',
                collectionName: 'production',
                elementName: `production_${substationid}`,
                elementDescription: `Production_${substationid}`,
                status: 'ACTIVE',
                elementType: 'PROVISIONING',
                uniqueTagName: '',
                uniqueTagValue: 0,
                uniqueTagStartValue: 0,
                uniqueTagValuePrefix: '',
                uniqueTagValueSuffix: '',
                businessTimeTagsRequired: false,
                optional: false,
                assetBased: true,
                uniqueTag: false,
              };
              let createdElement = false;
              createdElement = await this.createElement(object);
              if (createdElement) {
                this.setAlert({
                  show: true,
                  type: 'success',
                  message: 'SUB-STATION_CREATED_PROCESS_PARAMETERS',
                });
              }
              this.$refs.form.reset();
            }
            this.dialog = false;
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_SUB-STATION',
            });
          }
          this.saving = false;
        }
      }
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
  },
  watch: {
    newSubstation: {
      handler(val) {
        this.compareValues(val);
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>
