<template>
  <v-card
    hover
    outlined
    style="border-radius: 10px"
    @click="$router.push({ name: 'production-detail', params: { id: name } })"
  >
    <v-card-title
      class="py-1"
      :class="machineColor(machineData.machinestatus)"
    >
      {{ name }}
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('refresh-widget')">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-card-subtitle class="px-0 py-1 success--text title font-weight-regular">
        PRODUCTION
      </v-card-subtitle>
      <li>{{ plansRun }}</li>
      <li>{{ production }}</li>
      <li>{{ operators }}</li>
      <li class="mb-2">{{ nextPlan }}</li>
      <v-divider></v-divider>
      <v-card-subtitle class="px-0 py-1 info--text title font-weight-regular">
        REJECTION
      </v-card-subtitle>
      <li class="mb-2">{{ rejection }}</li>
      <v-divider></v-divider>
      <v-card-subtitle class="px-0 py-1 error--text title font-weight-regular">
        DOWNTIME
      </v-card-subtitle>
      <li>{{ downtimeCount }}</li>
      <li>{{ downtimeWithLimitCount }}</li>
      <li>{{ downtimeNoReasonCount }}</li>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MachineWidget',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      reportData: [
        {
          machinename: 'M1',
          machinestatus: 'UP',
          production: 2000,
          rejection: 10,
          plansRunSoFar: ['101-106', '101-107'],
          operators: [],
          nextPlan: null,
          downtimes: [
            {
              duration: 230,
            },
            {
              duration: 100,
            },
          ],
          downtimeWithNoReason: 0,
        },
        {
          machinename: 'M2',
          machinestatus: 'DOWN',
          production: 2000,
          rejection: 0,
          plansRunSoFar: ['101-156'],
          operators: ['Ganesh', 'Ramesh'],
          nextPlan: {
            planid: '101-242',
            scheduledstart: 'in about 4 hours',
          },
          downtimes: [
            {
              duration: 230,
            },
            {
              duration: 90,
            },
            {
              duration: 90,
            },
          ],
          downtimeWithNoReason: 2,
        },
        {
          machinename: 'P1',
          machinestatus: 'NOPLAN',
          production: 2000,
          rejection: 39,
          plansRunSoFar: [],
          operators: ['Suresh'],
          nextPlan: {
            planid: '101-302',
            scheduledstart: 'in about 30 minutes',
          },
          downtimes: [],
          downtimeWithNoReason: 10,
        },
        {
          machinename: 'P2',
          machinestatus: 'UP',
          production: 2000,
          rejection: 0,
          plansRunSoFar: ['101-157'],
          operators: [],
          nextPlan: {
            planid: '101-222',
            scheduledstart: 'in about 2 days',
          },
          downtimes: [
            {
              duration: 230,
            },
            {
              duration: 100,
            },
            {
              duration: 240,
            },
            {
              duration: 300,
            },
          ],
          downtimeWithNoReason: 4,
        },
      ],
    };
  },
  computed: {
    machineData() {
      return this.reportData.find((data) => data.machinename === this.name);
    },
    plansRun() {
      if (this.machineData.plansRunSoFar && this.machineData.plansRunSoFar.length === 1) {
        return `${this.machineData.plansRunSoFar.length} plan ran in this shift`;
      }
      if (this.machineData.plansRunSoFar.length > 1) {
        return `${this.machineData.plansRunSoFar.length} plans ran in this shift`;
      }
      return 'No running plan!';
    },
    operators() {
      if (this.machineData.operators && this.machineData.operators.length) {
        return `Operators - ${this.machineData.operators.join(', ')}`;
      }
      return 'No operator assigned!';
    },
    nextPlan() {
      if (this.machineData.nextPlan) {
        return `Next plan, ${this.machineData.nextPlan.planid}, ${this.machineData.nextPlan.scheduledstart}`;
      }
      return 'No upcoming plan!';
    },
    downtimeCount() {
      if (this.machineData.downtimes && this.machineData.downtimes.length === 1) {
        return `${this.machineData.downtimes.length} downtime in this shift`;
      }
      if (this.machineData.downtimes.length > 1) {
        return `${this.machineData.downtimes.length} downtimes in this shift`;
      }
      return 'No downtime in the shift!';
    },
    downtimeWithLimitCount() {
      const downtimes = this.machineData.downtimes.filter((d) => d.duration < 100);
      if (downtimes && downtimes.length === 1) {
        return `${downtimes.length} downtime less than a minute`;
      }
      if (downtimes.length > 1) {
        return `${downtimes.length} downtimes less than a minute`;
      }
      return 'No downtime in the shift!';
    },
    downtimeNoReasonCount() {
      if (this.machineData.downtimeWithNoReason) {
        return `${this.machineData.downtimeWithNoReason} downtimes with no reason assigned till date`;
      }
      return 'All downtimes are assigned a reason!';
    },
    production() {
      if (this.machineData.production) {
        return `${this.machineData.production} parts produced in this shift`;
      }
      return 'No production in this shift!';
    },
    rejection() {
      if (this.machineData.rejection) {
        return `${this.machineData.rejection} parts rejected in this shift`;
      }
      return 'No rejections in this shift!';
    },
  },
  methods: {
    machineColor(status) {
      switch (status) {
        case 'UP':
          return 'success';
        case 'DOWN':
          return 'error';
        default:
          return 'info';
      }
    },
  },
};
</script>
