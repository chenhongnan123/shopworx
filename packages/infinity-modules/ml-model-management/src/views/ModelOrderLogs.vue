<template>
  <v-container fluid class="py-0">
    <v-expansion-panels accordion class="mt-4">
          <v-expansion-panel
            v-for="(data, index) in modelDeploymentOrderList"
            :key="index"
          >
            <v-expansion-panel-header class="primary--text">
              <span>
                <v-icon left color="primary">mdi-order-bool-descending-variant</v-icon>
                Operation Name: {{ data.operationname }} | Model Status: {{ data.status }}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <div v-for="input in data.logslist" :key="input._id">
                    <v-text-field
                        v-if="input.name !== ''"
                        :value="input.status"
                        solo
                        disabled
                        style="width: 80%;margin-top: -5px; margin-bottom: -16px;"
                    ></v-text-field>
                </div>
            </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'ModelManagement',
  components: {
  },
  payloadData: {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('modelManagement', ['setSelectedParameterList']),
    ...mapActions('modelManagement', [
      'getModelDeploymentOrder',
      'getModelRecords',
    ]),
  },
  computed: {
    ...mapState('modelManagement', [
      'modelDeploymentOrderList',
      'processModelList',
    ]),
  },
  data() {
    return {
    };
  },
  async created() {
    await this.getModelDeploymentOrder('');
    console.log(this.modelDeploymentOrderList);
  },
};
</script>
<style>
</style>
