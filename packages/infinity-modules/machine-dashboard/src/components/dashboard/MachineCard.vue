<template>
  <v-card
    hover
    outlined
    style="height:100%; border-radius: 8px"
    @click="$router.push({ name: 'machine-detail', params: { id: machine.machinename } })"
  >
    <v-window v-model="card">
      <template v-if="Object.keys(assetState).length === 0">
        <v-card-title class="py-0 error" style="border-radius: 8px 8px 0px 0px">
          {{ machine.machinename }}
        </v-card-title>
        <v-card-text>
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
      <template v-else>
        <v-window-item
          v-for="asset in assetState"
          :key="asset.key"
        >
          <v-card-title
            class="py-0"
            style="border-radius: 8px 8px 0px 0px"
            :class="assetState && !assetState.isdown ? 'success' : 'error'"
          >
            {{ machine.machinename }}
            <v-spacer></v-spacer>
            <span v-if="assetState && assetState.isdown">
              {{ getDowntimeSince(assetState.actualdowntimestart) }}
            </span>
          </v-card-title>
          <v-card-text
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
                      {{ asset.partname }}
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="caption text-uppercase">
                      <span>
                        Production
                      </span>
                    </div>
                    <div class="headline">
                      {{ asset.qty }}
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
                      {{ asset.rqty || 0 }}
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="caption text-uppercase">
                      <span>
                        Rejection %
                      </span>
                    </div>
                    <div class="title">
                      {{ asset.rqty
                        ? ((asset.rqty / asset.qty) * 100).toFixed(2)
                        : 0 }} %
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="5" class="my-auto text-center">
                <div class="caption text-uppercase">Availability</div>
                <v-progress-circular
                  size="120"
                  width="15"
                  :value="asset.availability"
                  color="success"
                  :rotate="270"
                >
                  <div>
                    {{ asset.availability }}
                  </div>
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>
      </template>
    </v-window>
  </v-card>
</template>

<script>
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';
import { mapGetters } from 'vuex';

export default {
  name: 'MachineCard',
  props: {
    machine: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      card: 0,
      interval: null,
    };
  },
  created() {
    const self = this;
    this.interval = setInterval(() => {
      self.next();
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    ...mapGetters('machineDashboard', ['realTimeValue']),
    assetState() {
      return this.realTimeValue(this.machine.machinename);
    },
    len() {
      return this.assetState && Object.keys(this.assetState).length;
    },
  },
  methods: {
    getDowntimeSince(datetime) {
      return `Down since ${distanceInWordsToNow(
        new Date(datetime),
      )}`;
    },
    next() {
      if (this.card + 1 === this.len) {
        this.card = 0;
      } else {
        this.card += 1;
      }
    },
  },
};
</script>
