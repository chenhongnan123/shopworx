<template>
  <div>
    <span class="headline">
      Update business's holidays
    </span>
    <div v-if="fetching">
      Fetching holidays...
    </div>
    <validation-observer #default="{ invalid, validated, passes }" v-else>
      <v-form @submit.prevent="passes(save)">
        <v-card
          flat
          :key="index"
          class="mb-2"
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
                  label="Name"
                  hide-details="auto"
                  v-model="holiday.name"
                  :error-messages="errors"
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
                  label="Date"
                  hide-details="auto"
                  v-model="holiday.date"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-auto">
              <v-btn
                icon
                small
                class="mx-2"
                @click="addHoliday"
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                class="pa-0"
                @click="removeHoliday(index)"
                :disabled="holidays.length === 1"
              >
                <v-icon>mdi-minus-circle-outline</v-icon>
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
          :disabled="invalid || !validated"
        >
          <v-icon left>mdi-chevron-triple-right</v-icon>
            Continue to next step
        </v-btn>
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
  },
};
</script>
