<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template v-slot:activator="{ on }">
    <v-icon v-on="on" v-text="'$delete'"
    class="float-right" color="error"></v-icon>
    </template>
      <v-card>
        <v-card-title class="headline">Delete Substation?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        <span class="red--text"
        >
          <div v-if="this.parameter.length > 0">
            This Substation have Parameters and those are also deleted !
          </div>
          <div v-else>
            This Substation Don't Have any Parameter!
          </div>
        </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteSubstation"
            :loading="deleting"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      newSubstation: {},
      assetId: 4,
      default: false,
      dialog: false,
      deleting: false,
      parameter: [],
    };
  },
  props: {
    substation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('productionLayout', [
      'parametersList',
    ]),
  },
  async created() {
    await this.getParameterList('');
    this.invoke();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['deleteSubstation', 'getParameterList', 'getSubStationIdElement']),
    async invoke() {
      const parameterInfo = this.parametersList
        .filter((p) => p.substationid === this.substation.id);
      this.parameter = parameterInfo;
    },
    async btnDeleteSubstation() {
      const deletedElement = await this.getSubStationIdElement(this.substation.id);
      // const deleted = false;
      console.log(deletedElement);
      if (!deletedElement) {
        const defaultElementId = 0;
        const subStationObject2 = {
          id: this.substation.id,
          sublineid: this.substation.sublineid,
          lineid: this.substation.lineid,
          elementId: defaultElementId,
          status: 'INACTIVE',
        };
        let deleted = false;
        this.deleting = true;
        deleted = await this.deleteSubstation(subStationObject2);
        if (deleted) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'SUBSTATION__DELETED',
          });
          this.deleting = false;
          this.dialog = false;
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_DELETING_SUBSTATION',
          });
        }
        this.dialog = false;
      } else {
        const subStationObject = {
          id: this.substation.id,
          sublineid: this.substation.sublineid,
          lineid: this.substation.lineid,
          elementId: deletedElement.id,
          status: 'INACTIVE',
        };
        let deleted = false;
        this.deleting = true;
        deleted = await this.deleteSubstation(subStationObject);
        if (deleted) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'SUBSTATION_DEPENDANT_DELETED',
          });
          this.deleting = false;
          this.dialog = false;
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_DELETING_SUBSTATION',
          });
        }
        this.dialog = false;
      }
    },
  },
};
</script>
