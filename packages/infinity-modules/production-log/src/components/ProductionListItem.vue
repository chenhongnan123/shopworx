<template>
  <v-card outlined>
    <v-card-title>
      <div>
        {{ production.planid }}
      </div>
      <v-spacer></v-spacer>
      <div>
        {{ new Date(production.firstcycle).toLocaleTimeString('en-US') }}
        to
        {{ new Date(production.lastcycle).toLocaleTimeString('en-US') }}
      </div>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters >
        <v-col cols="12" sm="6">
          <div class="body-2">
            Shift
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            {{ production.shift }}
          </div>
          <div class="body-2">
            Part
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            {{ production.partname }}
          </div>
        </v-col>
        <v-col cols="12" sm="2">
          <div class="body-2">
            Produced
          </div>
          <div class="text-uppercase title font-weight-regular mb-2 info--text">
            {{ production.produced }}
          </div>
          <div class="body-2">
            Accepted
          </div>
          <div class="text-uppercase title font-weight-regular mb-2 success--text">
            {{ production.accepted }}
          </div>
        </v-col>
        <v-col cols="12" sm="2">
          <div class="body-2">
            Rejected
          </div>
          <div class="text-uppercase title font-weight-regular mb-2 error--text">
            {{ production.rejected }}
          </div>
          <div class="body-2">
            Rework
          </div>
          <div class="text-uppercase title font-weight-regular mb-2 error--text">
            {{ production.rejected }}
          </div>
        </v-col>
        <v-col cols="12" sm="2">
          <div class="body-2">
            Scrap (in Kgs)
          </div>
          <div class="text-uppercase title font-weight-regular mb-2 warning--text">
            {{ production.accepted }}
          </div>
          <div class="body-2">
            Waste (in Kgs)
          </div>
          <div class="text-uppercase title font-weight-regular mb-2 warning--text">
            {{ production.accepted }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <production-split
        :production="production"
        :duration="duration"
      />
      <v-btn
        small
        outlined
        color="primary"
        class="text-none"
      >
        <v-icon left>mdi-plus</v-icon>
        Re-works
      </v-btn>
      <v-btn
        small
        outlined
        color="primary"
        class="text-none"
      >
        <v-icon left>mdi-plus</v-icon>
        Scrap
      </v-btn>
      <v-btn
        small
        outlined
        color="primary"
        class="text-none"
      >
        <v-icon left>mdi-plus</v-icon>
        Waste
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ProductionSplit from './ProductionSplit.vue';

export default {
  name: 'ProductionListItem',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  components: {
    ProductionSplit,
  },
  computed: {
    ...mapState('productionLog', ['toggleSelection', 'selectedProductions']),
    duration() {
      const d = this.production.productionduration;
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      return `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
    },
  },
  methods: {
    ...mapMutations('productionLog', [
      'setSelectedProductions',
    ]),
  },
};
</script>
