<template>
  <v-card outlined>
    <v-card-title primary-title>
      <v-avatar
        size="24"
        :color="planStatusClass(plan.status)"
      ></v-avatar>
      <span class="ml-2">
        {{ plan.planid }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="6" md="4">
          <div>
            <span>Part</span>
            <span>: {{ plan.partname }}</span>
          </div>
          <div>
            <span>Machine</span>
            <span>: {{ plan.machinename }}</span>
          </div>
          <div>
            <span>{{ plan.assetid === 2 ? 'Mold' : 'Tool' }}</span>
            <span>: {{ plan.assetid === 2 ? plan.moldname : plan.toolname }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="plan.status === 'notStarted'">
          <div>
            <v-icon>mdi-clock-check-outline</v-icon>
            <span class="ml-2">Scheduled start</span>
            <span>: {{ formattedDate(plan.scheduledstart) }}</span>
          </div>
          <div>
            <span class="ml-8">Scheduled end</span>
            <span>: {{ formattedDate(plan.scheduledend) }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-else>
          <div>
            <v-icon>mdi-clock-check-outline</v-icon>
            <span class="ml-2">Started at</span>
            <span>: {{ formattedDate(plan.actualstart) }}</span>
          </div>
          <div>
            <span class="ml-8">Scheduled end</span>
            <span>: {{ formattedDate(plan.scheduledend) }}</span>
          </div>
        </v-col>
        <v-divider vertical class="mr-2" v-if="$vuetify.breakpoint.msAndUp"></v-divider>
        <v-col cols="12" sm="6" md="3" class="my-auto">
          <v-progress-linear
            :value="plan.actualquantity || 0"
            :height="20"
            color="secondary"
          >
            <span class="font-weight-medium">
              {{plan.actualquantity || 0}}/{{plan.plannedquantity}}
            </span>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'PlanCard',
  props: {
    plan: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('planning', ['planStatusClass']),
  },
  methods: {
    formattedDate(date) {
      return formatDate(new Date(date), 'PPp');
    },
  },
};
</script>
