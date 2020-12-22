<template>
    <div>
      <span
        class="title font-weight-regular"
        v-if="title"
        v-text="title"
      ></span>
      <v-card :class="title === null ? 'mt-8' : ''">
        <v-card-title class="pb-0">
          Latest plans
        </v-card-title>
        <v-card-text class="py-0">
          <v-list two-line>
            <template v-for="(plan, i) in plans">
              <v-list-item :key="i" @click="$router.push(`/planning/${plan.planid}`)">
                <v-list-item-avatar>
                  <v-avatar size="24" :color="planStatusClass(plan.planstatus)">
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content >
                  <v-list-item-title>
                    <span v-text="plan.planid"></span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span v-text="plan.machinename"></span>
                    <span class="ml-4" v-text="plan.partname"></span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="`d-${i}`"></v-divider>
            </template>
          </v-list>
        </v-card-text>
        <v-divider v-if="action !== null"></v-divider>
        <v-card-actions class="pa-0">
          <v-select
            solo
            flat
            dense
            single-line
            hide-details
            v-if="showDateFilter"
            :items="['Today', 'Yesterday', 'Last 7 days']"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            class="text-none"
            v-if="action !== null"
            @click="$router.push(action.route)"
          >
            <span v-text="action.text"></span>
            <v-icon right>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
</template>

<script>
export default {
  name: 'ListWidget',
  data() {
    return {
      plans: [
        {
          planid: '101-11007',
          planstatus: 'In Progress',
          partname: '2 inch b.v ring',
          machinename: '09-TOS-125T8-293G-2CR',
        },
        {
          planid: '101-11000',
          planstatus: 'Not Started',
          partname: '2 inch b.v ring',
          machinename: '09-TOS-125T8-293G-2CR',
        },
        {
          planid: '101-10988',
          planstatus: 'In Progress',
          partname: '2 inch b.v ring',
          machinename: '09-TOS-125T8-293G-2CR',
        },
        {
          planid: '101-10959',
          planstatus: 'In Progress',
          partname: '2 inch b.v ring',
          machinename: '09-TOS-125T8-293G-2CR',
        },
        {
          planid: '101-10953',
          planstatus: 'Abort',
          partname: '2 inch b.v ring',
          machinename: '09-TOS-125T8-293G-2CR',
        },
        {
          planid: '101-10938',
          planstatus: 'Complete',
          partname: '2 inch b.v ring',
          machinename: '09-TOS-125T8-293G-2CR',
        },
        {
          planid: '101-10937',
          planstatus: 'Complete',
          partname: '2 inch b.v ring',
          machinename: '09-TOS-125T8-293G-2CR',
        },
      ],
    };
  },
  methods: {
    planStatusClass(planstatus) {
      switch (planstatus) {
        case 'In Progress': return 'warning';
        case 'Not Started': return 'info';
        case 'Abort': return 'error';
        case 'Complete': return 'success';
        default: return '';
      }
    },
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    action: {
      type: Object,
      default: null,
    },
    showDateFilter: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
