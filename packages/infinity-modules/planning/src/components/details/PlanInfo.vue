<template>
  <div>
    <span class="title font-weight-regular">Plan details</span>
    <v-card
      :style="`border-left: 6px solid var(--v-${planStatusClass(plan[0].status)}-base)`"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="caption text-uppercase">
              <span>
                Machine
              </span>
            </div>
            <div class="headline">
              {{ plan[0].machinename }}
            </div>
          </v-col>
          <v-col cols="12">
            <div class="caption text-uppercase">
              <span>
                {{ plan[0].assetid === 2 ? 'Mold' : 'Tool' }}
              </span>
            </div>
            <div class="headline">
              {{ plan[0].assetid === 2
              ? plan[0].moldname
              : plan[0].toolname }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption text-uppercase">
              <span>
                Total cavities
              </span>
            </div>
            <div class="headline">
              {{ plan[0].cavity }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption text-uppercase">
              <span>
                Active cavities
              </span>
            </div>
            <div class="headline">
              {{ plan[0].activecavity }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption text-uppercase">
              <span>
                Cycle time
              </span>
            </div>
            <div class="headline">
              {{ plan[0].stdcycletime }} secs
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption text-uppercase">
              <span>
                {{ plan[0].status === 'notStarted'
                  ? 'Scheduled start'
                  : 'Actual start' }}
              </span>
            </div>
            <div class="headline">
              {{ getStartTime(plan[0].status === 'notStarted'
                  ? plan[0].scheduledstart
                  : plan[0].actualstart) }}
            </div>
          </v-col>
          <v-col cols="12">
            <div class="caption text-uppercase">
              <span>
                Part
              </span>
            </div>
            <div>
              <template v-for="(p, n) in plan">
                <v-progress-linear
                  :key="n"
                  :height="25"
                  class="mt-1"
                  color="secondary"
                  :value="(getPartQty(p.partname) / p.plannedquantity) * 100"
                >
                  <span class="font-weight-medium mr-auto ml-2">
                    {{ p.partname }}
                  </span>
                  <span class="font-weight-medium ml-auto mr-2">
                    {{getPartQty(p.partname)}}/{{p.plannedquantity}}
                  </span>
                </v-progress-linear>
              </template>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'PlanInfo',
  computed: {
    ...mapGetters('planning', ['planStatusClass', 'realTimeValue']),
    ...mapState('planning', ['planDetails']),
    id() {
      return this.$route.params.id;
    },
    plan() {
      return this.planDetails[this.id];
    },
  },
  methods: {
    getPartQty(partname) {
      const val = this.realTimeValue(this.id);
      return (val !== {}
        && val[partname]
        && val[partname].qty) || 0;
    },
    getStartTime(time) {
      return distanceInWordsToNow(
        new Date(time),
        { addSuffix: true },
      );
    },
  },
};
</script>
