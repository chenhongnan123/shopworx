<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          color="primary"
          class="text-none"
          :loading="saving"
          @click="save"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          {{ $t('admin.save') }}
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="fetchRecords"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          {{ $t('admin.refresh') }}
        </v-btn>
      </span>
    </portal>
    <v-progress-circular
      indeterminate
      v-if="loading"
    ></v-progress-circular>
    <v-chip-group
      v-else
      column
      multiple
      mandatory
      class="my-2"
      v-model="workingDays"
      active-class="primary"
    >
      <v-chip
        large
        :key="index"
        :id="`day-${index}`"
        v-for="(day, index) in days"
        v-text="$t(`setup.onboardCalendar.days.${day}`)"
      ></v-chip>
    </v-chip-group>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'BusinessWorkingDays',
  data() {
    return {
      loading: false,
      saving: false,
      days: [
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat',
      ],
      workingDays: [1, 2, 3, 4, 5, 6],
    };
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapActions('element', ['getRecords', 'upsertBulkRecords']),
    async fetchRecords() {
      this.loading = true;
      const records = await this.getRecords({
        elementName: 'businessworkingdays',
      });
      if (records && records.length) {
        this.workingDays = records
          .filter((rec) => rec.isWorking)
          .map((rec) => rec.day);
      }
      this.loading = false;
    },
    async save() {
      this.saving = true;
      const records = this.days.map((day, index) => {
        let isWorking = false;
        if (this.workingDays.includes(index)) {
          isWorking = true;
        }
        return {
          day: index,
          isWorking,
        };
      });
      const payload = {
        elementName: 'businessworkingdays',
        records,
      };
      await this.upsertBulkRecords(payload);
      this.saving = false;
    },
  },
};
</script>
