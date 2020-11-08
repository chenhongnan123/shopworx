<template>
  <v-card outlined>
    <v-card-title>
      {{ production.partname }}
      <v-spacer></v-spacer>
      {{ new Date(production.firstcycle).toLocaleTimeString('en-US') }}
      to
      {{ new Date(production.lastcycle).toLocaleTimeString('en-US') }}
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <div class="body-2">
            Plan
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            {{ production.planid }}
          </div>
          <div class="body-2">
            Shift
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            {{ production.shift }}
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <v-row no-gutters>
            <v-col cols="12" sm="4">
              <div class="body-2">
                Produced
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 info--text">
                {{ production.produced }}
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="body-2">
                Accepted
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 success--text">
                {{ production.accepted }}
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" sm="4">
              <div class="body-2">
                Rejected
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 error--text">
                {{ production.rejected }}
                <assign-rejections :production="production" />
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="body-2">
                Rework
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 error--text">
                {{ production.rework }}
                <assign-rework :production="production" />
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="body-2">
                Scrap (in Kgs)
              </div>
              <div class="text-uppercase title font-weight-regular mb-2 warning--text">
                {{ production.scrap }}
                <assign-scrap :production="production" />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import AssignRejections from './AssignRejections.vue';
import AssignRework from './AssignRework.vue';
import AssignScrap from './AssignScrap.vue';

export default {
  name: 'ProductionListItem',
  components: {
    AssignRejections,
    AssignRework,
    AssignScrap,
  },
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  computed: {
    duration() {
      const d = this.production.productionduration;
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      return `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
    },
  },
};
</script>
