<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="600px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Create plan
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          clearable
          label="Part"
          :items="parts"
          return-object
          item-text="partname"
          v-model="plan.part"
          :loading="loadingParts"
          prepend-icon="$production"
          @change="onPartSelection(plan.part)"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.partname"></v-list-item-title>
              <v-list-item-subtitle v-text="item.partnumber"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <template v-if="plan.part">
          <v-autocomplete
            label="Machine"
            class="ml-8"
            item-text="machinename"
            item-value="machinename"
            v-model="plan.machinename"
            :items="partMatrixRecords(plan.toolname ? {
              name: 'toolname',
              value: plan.toolname
            } : null)"
          ></v-autocomplete>
          <v-autocomplete
            label="Tool"
            class="ml-8"
            item-text="toolname"
            item-value="toolname"
            v-model="plan.toolname"
            :items="partMatrixRecords(plan.machinename ? {
              name: 'machinename',
              value: plan.machinename
            } : null)"
          ></v-autocomplete>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text class="text-none">More options</v-btn>
        <v-btn color="primary" class="text-none">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'AddPlan',
  data() {
    return {
      plan: {
        part: null,
        machinename: '',
        toolname: '',
      },
      dialog: true,
      loadingParts: false,
    };
  },
  computed: {
    ...mapState('planning', ['parts']),
    ...mapGetters('planning', [
      'planningTags',
      'filteredPartMatrixRecords',
      'partMatrixComposition',
    ]),
  },
  async created() {
    this.loadingParts = true;
    await this.getParts();
    this.loadingParts = false;
  },
  methods: {
    ...mapActions('planning', ['getParts', 'getPartMatrixRecords']),
    partMatrixRecords(filter) {
      return this.filteredPartMatrixRecords(filter);
    },
    async onPartSelection(part) {
      if (part) {
        await this.getPartMatrixRecords(part);
        this.partMatrixComposition(part.assetid);
        this.planningTags(part.assetid);
      } else {
        this.plan.machinename = '';
        this.plan.toolname = '';
      }
    },
  },
};
</script>
