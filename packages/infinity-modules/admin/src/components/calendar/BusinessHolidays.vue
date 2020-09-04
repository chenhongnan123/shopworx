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
          Save
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="fetchRecords"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          Refresh
        </v-btn>
      </span>
    </portal>
    <v-progress-circular
      indeterminate
      v-if="loading"
    ></v-progress-circular>
    <validation-observer #default="{ passes }" v-else>
      <v-form @submit.prevent="passes(save)">
        <v-card
          flat
          :key="index"
          class="mb-2 transparent"
          v-for="(holiday, index) in holidays"
        >
          <v-row>
            <v-col cols="4">
              <validation-provider
                name="name"
                rules="required"
                #default="{ errors }"
              >
                <v-text-field
                  type="text"
                  hide-details="auto"
                  :id="`name-${index}`"
                  v-model="holiday.name"
                  :error-messages="errors"
                  :disabled="loading"
                  :label="$t('setup.onboardCalendar.holidays.name')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="5">
              <validation-provider
                name="date"
                rules="required"
                #default="{ errors }"
              >
                <v-text-field
                  type="date"
                  hide-details="auto"
                  :id="`date-${index}`"
                  v-model="holiday.date"
                  :error-messages="errors"
                  :disabled="loading"
                  :label="$t('setup.onboardCalendar.holidays.date')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-auto">
              <v-btn
                icon
                small
                class="mx-2"
                @click="addHoliday"
                :id="`add-${index}`"
              >
                <v-icon v-text="'$add'"></v-icon>
              </v-btn>
              <v-btn
                icon
                small
                class="pa-0"
                :id="`remove-${index}`"
                @click="removeHoliday(index)"
                :disabled="holidays.length === 1"
              >
                <v-icon v-text="'$remove'"></v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider v-if="index + 1 != holidays.length"></v-divider>
        </v-card>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'BusinessHolidays',
  data() {
    return {
      loading: false,
      saving: false,
      holidays: [{
        name: '',
        date: '',
      }],
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
        elementName: 'businessholidays',
      });
      if (records && records.length) {
        this.holidays = records.map((rec) => ({
          name: rec.name,
          date: rec.date,
        }));
      }
      this.loading = false;
    },
    addHoliday() {
      this.holidays.push({
        name: '',
        date: '',
      });
    },
    removeHoliday(index) {
      this.holidays.splice(index, 1);
    },
    async save() {
      this.saving = true;
      const payload = {
        elementName: 'businessholidays',
        records: this.holidays,
      };
      await this.upsertBulkRecords(payload);
      this.saving = false;
    },
  },
};
</script>
