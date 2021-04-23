<template>
  <div style="height: calc(100% - 266px);overflow: auto;">
    <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
      <v-timeline-item
        v-for="(item, i) in todoList"
        :key="i"
        :color="getColor(item.status)"
        :icon="item.status == 'completed' ? 'mdi-clock-check-outline' : 'mdi-progress-clock'"
        fill-dot
      >
        <v-card :color="getColor(item.status)" style="width: 450px;">
          <v-card-title class="title">
            <span>{{ format(Number(item.planstarttime), 'yyyy-MM-dd') }}</span>
            <v-spacer></v-spacer>
            <v-btn small color="white" outlined class="text-none">
              {{ item.status }}
            </v-btn>
          </v-card-title>
          <v-card-text class="white text--primary pa-0">
            <v-list class="pb-0 px-4">
              <v-list-item-group class="mb-1">
                <v-list-item-content class="py-1">
                  <span class="font-weight-bold" style="flex: none;"
                    >{{ $t('maintenancetask.taskheader.machinename') }}:
                  </span>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{ item.machinename }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-1">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('maintenancetask.taskheader.solutionname') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{ item.solutionname }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-1">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('maintenancetask.taskheader.actualstarttime') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{
                      item.acturalstarttime
                        ? format(new Date(Number(item.acturalstarttime)), "yyyy-MM-dd'T'HH:mm")
                        : ''
                    }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-0">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('maintenancetask.taskheader.actualendtime') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{
                      item.acturalendtime
                        ? format(new Date(Number(item.acturalendtime)), "yyyy-MM-dd'T'HH:mm")
                        : ''
                    }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-card-actions class="py-0">
            <v-spacer></v-spacer>
            <v-btn text color="white accent-4" @click="handleClick(item)">
              {{ $t('general.more') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import { formatDate } from '@shopworx/services/util/date.service';
import { mapState } from 'vuex';

export default {
  name: 'WelcomeTimeline',
  data: () => ({
    format: formatDate,
  }),
  methods: {
    getColor(status) {
      if (status === 'in progress') return 'red';
      if (status === 'assigned') return 'orange';
      if (status === 'completed') return 'green';
      return 'blue';
    },
    handleClick(value) {
      this.$router.push({ name: 'taskdetail', params: { id: value.id } });
    },
  },
  computed: {
    ...mapState('maintenance', ['todoList']),
    ...mapState('auth', ['operator']),
  },
};
</script>
