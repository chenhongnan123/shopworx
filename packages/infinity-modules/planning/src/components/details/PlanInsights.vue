<template>
  <div>
    <span class="title font-weight-regular">Plan analytics</span>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="caption text-uppercase">
              <span>
                {{ plan[0].status === 'notStarted'
                  ? 'Scheduled end'
                  : 'Estimated end' }}
              </span>
            </div>
            <div class="headline">
              {{ endTime }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption text-uppercase">
              <span>
                Performance
              </span>
            </div>
            <div class="headline">
              {{ getPerformance(plan[0]) }}%
            </div>
          </v-col>
          <v-col cols="6">
            <div class="caption text-uppercase">
              <span>
                Quality
              </span>
            </div>
            <div class="headline">
              {{ getQuality(plan[0]) }}%
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'PlanInsights',
  computed: {
    ...mapState('planning', ['planDetails']),
    ...mapGetters('planning', ['realTimeValue']),
    id() {
      return this.$route.params.id;
    },
    plan() {
      return this.planDetails[this.id];
    },
  },
  data() {
    return {
      endTime: '-',
      interval: null,
    };
  },
  created() {
    const self = this;
    this.interval = setInterval(async () => {
      await self.getEstimatedEnd(this.plan[0]);
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions('planning', ['getScheduledEnd']),
    getRemainingDuration(plan) {
      const val = this.realTimeValue(plan.planid);
      return (val !== {}
        && val[plan.partname]
        && val[plan.partname].remainingDuration) || 0;
    },
    getPerformance(plan) {
      const val = this.realTimeValue(plan.planid);
      return (val !== {}
        && val[plan.partname]
        && val[plan.partname].performance) || 0;
    },
    getQuality(plan) {
      const val = this.realTimeValue(plan.planid);
      return (val !== {}
        && val[plan.partname]
        && val[plan.partname].quality) || 0;
    },
    getEndTime(time) {
      return distanceInWordsToNow(
        new Date(time),
        { addSuffix: true },
      );
    },
    async getEstimatedEnd(plan) {
      const duration = this.getRemainingDuration(plan);
      if (plan.status === 'notStarted') {
        this.endTime = this.getEndTime(plan.scheduledend);
      } else if (duration !== 0) {
        const end = await this.getScheduledEnd({
          start: new Date().getTime(),
          duration,
        });
        this.endTime = this.getEndTime(end);
      }
    },
  },
};
</script>
