<template>
  <v-card
    hover
    outlined
    style="height:100%; border-radius: 8px"
    @click="$router.push({ name: 'machine-detail', params: { id: machine.machinename } })"
  >
    <v-card-title
      class="py-0"
      :class="assetState && !assetState.isdown ? 'success' : 'error'"
    >
      {{ machine.machinename }}
      <v-spacer></v-spacer>
      <span v-if="assetState && assetState.isdown">
        {{ getDowntimeSince(assetState.actualdowntimestart) }}
      </span>
    </v-card-title>
    <template>
      <v-card-text
        v-if="assetState"
        style="height:100%"
        :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
      >
        <v-row style="height:100%">
          <v-col cols="7" class="my-auto">
            <v-row>
              <v-col cols="12">
                <div class="caption text-uppercase">
                  <span>
                    Product
                  </span>
                </div>
                <div class="headline">
                  {{ assetState.partname }}
                </div>
              </v-col>
              <v-col cols="12">
                <div class="caption text-uppercase">
                  <span>
                    Production
                  </span>
                </div>
                <div class="headline">
                  {{ assetState.qty }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <div class="caption text-uppercase">
                  <span>
                    Rejections
                  </span>
                </div>
                <div class="title">
                  {{ assetState.rqty }}
                </div>
              </v-col>
              <v-col cols="6">
                <div class="caption text-uppercase">
                  <span>
                    Rejection %
                  </span>
                </div>
                <div class="title">
                  {{ ((assetState.rqty / assetState.qty) * 100).toFixed(2) }} %
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5" class="my-auto text-center">
            <div class="caption text-uppercase">Availability</div>
            <v-progress-circular
              size="120"
              width="15"
              :value="assetState.availability"
              color="success"
              :rotate="270"
            >
              <div>
                {{ assetState.availability }}
              </div>
            </v-progress-circular>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <v-container fill-height>
          <v-row
            align="center"
            justify="center"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <v-col cols="12" align="center">
              <span class="headline">
                Waiting for {{ machine.machinename }} events...
              </span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';
import { mapState } from 'vuex';

export default {
  name: 'MachineCard',
  props: {
    machine: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('machineDashboard', ['assetData']),
    assetState() {
      return this.assetData && this.assetData[this.machine.machinename];
    },
  },
  methods: {
    getDowntimeSince(datetime) {
      return `Down since ${distanceInWordsToNow(
        new Date(datetime),
      )}`;
    },
  },
};
</script>
