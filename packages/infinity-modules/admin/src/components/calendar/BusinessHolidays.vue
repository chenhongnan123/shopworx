<template>
  <div>
    <portal to="settings-header">
      <span>
        <!-- <v-btn
          small
          color="primary"
          class="text-none"
          :loading="saving"
          @click="save"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          {{ $t('admin.save') }}
        </v-btn> -->
        <add-holiday :holidays="holidays" @added="fetchRecords"/>
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
    <!-- <validation-observer #default="{ handleSubmit }" v-else>
      <v-form @submit.prevent="handleSubmit(save)">
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
    </validation-observer> -->
    <v-data-table
      item-key="id"
      class="transparent"
      :items="holidays"
      :headers="headers"
      disable-pagination
      hide-default-footer
      v-else
    >
      <!-- eslint-disable-next-line -->
      <template #item.actions="{ item }">
        <v-btn
          icon
          @click="deleteHoliday(item)"
          :loading="deleting"
        >
          <v-icon v-text="'$delete'"></v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import AddHoliday from './AddHoliday';

export default {
  name: 'BusinessHolidays',
  components: {
    AddHoliday,
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        {
          text: 'Date',
          align: 'start',
          sortable: true,
          value: 'date',
        },
        {
          text: 'Actions',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
      ],
      loading: false,
      holidays: [],
      deleting: false,
    };
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapActions('element', ['getRecords', 'upsertBulkRecords', 'deleteRecordById']),
    async fetchRecords() {
      this.loading = true;
      const records = await this.getRecords({
        elementName: 'businessholidays',
      });
      if (records && records.length) {
        this.holidays = records.map((rec) => ({
          id: rec._id,
          name: rec.name,
          date: rec.date,
        }));
      } else {
        this.holidays = [];
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
    async deleteHoliday(item) {
      this.deleting = true;
      const payload = {
        elementName: 'businessholidays',
        id: item.id,
      };
      await this.deleteRecordById(payload);
      this.deleting = false;
      this.fetchRecords();
    },
    // async save() {
    //   const payload = {
    //     elementName: 'businessholidays',
    //     records: this.holidays,
    //   };
    //   await this.upsertBulkRecords(payload);
    // },
  },
};
</script>
