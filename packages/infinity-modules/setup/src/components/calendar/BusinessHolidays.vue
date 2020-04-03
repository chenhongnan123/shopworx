<template>
  <div>
    <span class="headline">
      {{ $t('setup.onboardCalendar.holidays.title') }}
    </span>
    <div v-if="fetching">
      {{ $t('setup.onboardCalendar.holidays.title') }}
    </div>
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
                name="Name"
                rules="required"
                #default="{ errors }"
              >
                <v-text-field
                  type="text"
                  hide-details="auto"
                  :id="`name-${index}`"
                  v-model="holiday.name"
                  :error-messages="errors"
                  :disabled="skipping || loading"
                  :label="$t('setup.onboardCalendar.holidays.name')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="5">
              <validation-provider
                name="Date"
                rules="required"
                #default="{ errors }"
              >
                <v-text-field
                  type="date"
                  hide-details="auto"
                  :id="`date-${index}`"
                  v-model="holiday.date"
                  :error-messages="errors"
                  :disabled="skipping || loading"
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
        <v-btn
          block
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
          id="finishHolidays"
          :disabled="skipping"
        >
          <v-icon
            left
            v-text="'$skip'"
          ></v-icon>
          {{ $t('setup.onboardCalendar.holidays.continue') }}
        </v-btn>
        <div class="text-center">
          <span>{{ $t('helper.or') }}</span>
        </div>
        <div class="text-center">
          <v-btn
            text
            @click="skip"
            color="primary"
            class="text-none"
            id="skipHolidays"
            :disabled="loading"
            :loading="skipping"
          >
            {{ $t('helper.skip') }}
          </v-btn>
        </div>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'BusinessHolidays',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    master: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fetching: false,
      skipping: false,
      holidays: [{
        name: '',
        date: '',
      }],
    };
  },
  computed: {
    masterDetails() {
      return this.master.find((m) => m.element.elementName.toLowerCase().trim() === 'businessholidays');
    },
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapActions('setup', ['getElementRecords']),
    ...mapActions('element', ['createElementAndTags']),
    async fetchRecords() {
      this.fetching = true;
      const records = await this.getElementRecords({
        assetId: 0,
        elementName: this.masterDetails.element.elementName,
      });
      if (records && records.length) {
        this.holidays = records.map((rec) => ({
          name: rec.name,
          date: rec.date,
        }));
      }
      this.fetching = false;
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
    save() {
      const payload = {
        element: this.masterDetails.element,
        tags: this.masterDetails.tags,
        records: this.holidays,
      };
      this.$emit('save', payload);
    },
    async skip() {
      this.skipping = true;
      const payload = {
        element: this.masterDetails.element,
        tags: this.masterDetails.tags,
      };
      const success = await this.createElementAndTags(payload);
      if (success) {
        this.$emit('skip');
      }
      this.skipping = false;
    },
  },
};
</script>
