<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
   >
   <template v-slot:activator="{ on }">
    <v-btn
    v-on="on"
    small color="primary" class="text-none" @click="addNewRoadmap">
            <v-icon small left>mdi-plus</v-icon>
            Add roadmap
    </v-btn>
    </template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Roadmap
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="(dialog = false); dialogReset();">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
            :disabled="saving"
            label="Roadmap name"
            prepend-icon="mdi-tray-plus"
            v-model="roadmap.name"
            :rules="updateRnamerule"
            required
            :counter="10"
            @keyup="validName"
        ></v-text-field>
        <v-select
          hide-details
          label="Select Roadmap type"
          :items="roadmapTypeList"
          item-text="name"
          prepend-icon="$production"
          :rules="roadmapTyperule"
          v-model="roadmap.roadmaptype"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="saveRoadmap"
          :disabled="!valid"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'AddRoadmapList',
  data() {
    return {
      // deleting: false,
      dialog: false,
      dialogConfirm: false,
      roadmap: {},
      roadmaps: [],
      saving: false,
      hover: true,
      lineSelected: null,
      subLineSelected: null,
      stationSelected: null,
      showLineFilter: true,
      itemForDelete: null,
      flagNewUpdate: false,
      updateRoadmapId: 0,
      editedVersionNumber: 0,
      valid: true,
      name: '',
      roadmaptype: '',
      updateRnamerule: [(v) => !!v || 'Required RoadMap Name',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
        (v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters ( including space ) not allowed'],
      roadmapTyperule: [(v) => !!v || 'Selection Required'],
    };
  },
  computed: {
    ...mapState('roadmapManagement', ['roadmapList', 'roadmapTypeList', 'createdRoadmap']),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname;
      },
    },
  },
  methods: {
    ...mapActions('roadmapManagement', ['getRecords',
      'createRoadmap',
      'getRoadmapTypeList',
      'deleteRoadmapById',
      'updateRoadmap',
      'getDetailsRecords',
      'createBulkRoadmapDetails']),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('roadmapManagement', ['toggleFilter']),
    addNewRoadmap() {
      this.dialog = true;
      this.flagNewUpdate = false;
    },
    async saveRoadmap() {
      this.$refs.form.validate();
      if (!this.roadmap.name) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ROADMAP_NAME_EMPTY',
        });
      } else if (!this.roadmap.roadmaptype) {
        this.roadmap.roadmaptype = '';
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ROADMAP_TYPE_NOT_SELECTED',
        });
      } else {
        this.saving = true;
        this.roadmap = {
          ...this.roadmap,
          versionnumber: 1,
          assetid: 4,
          createdby: this.userName,
        };
        let created = false;
        const payload = this.roadmap;
        created = await this.createRoadmap(payload);
        if (created) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'ROADMAP_CREATED',
          });
          this.dialog = false;
          this.roadmap = {};
          this.$refs.form.reset();
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_ROADMAP',
          });
        }
        this.saving = false;
      }
    },
    async dialogReset() {
      this.$refs.form.reset();
    },
    async validName() {
      const roadmapFlag = this.roadmapList
        .filter((o) => o.name.toLowerCase().split(' ').join('') === this.roadmap.name.toLowerCase().split(' ').join(''));
      if (roadmapFlag.length > 0) {
        // this.valid = false;
        this.roadmap.name = '';
        this.validupdate = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ALREADY_EXSIST',
        });
      } else {
        // this.valid = true;
        this.valid = false;
      }
    },
  },
};
</script>

<style>

</style>
