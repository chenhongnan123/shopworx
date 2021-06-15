<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on }">
      <v-btn
        small
        v-on="on"
        color="primary"
        class="text-none"
        :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
      >
        <v-icon
          left
          small
          v-text="'mdi-plus'"
        ></v-icon>
        Add holiday
      </v-btn>
    </template>
    <v-form @submit.prevent="onSubmit" ref="form" v-model="isValid">
      <v-card>
        <v-card-title primary-title>
          <span>Add holiday</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row
            :key="index"
            v-for="(holiday, index) in newHolidays"
          >
            <v-col cols="4">
              <v-text-field
                type="text"
                hide-details="auto"
                :id="`name-${index}`"
                v-model="holiday.name"
                :rules="nameRules"
                :disabled="loading"
                :label="$t('setup.onboardCalendar.holidays.name')"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                type="date"
                hide-details="auto"
                :id="`date-${index}`"
                v-model="holiday.date"
                :rules="dateRules"
                :label="$t('setup.onboardCalendar.holidays.date')"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="mt-4">
              <v-btn
                icon
                small
                class="ml-8 mr-2"
                @click="addHoliday"
                :id="`add-${index}`"
              >
                <v-icon v-text="'$add'"></v-icon>
              </v-btn>
              <v-btn
                icon
                small
                :id="`remove-${index}`"
                @click="removeHoliday(index)"
                :disabled="holidays.length === 1"
              >
                <v-icon v-text="'$remove'"></v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary"
            id="saveHolidays"
            class="text-none mb-2 mr-3"
            :loading="loading"
            :disabled="!isValid"
          >
            {{ $t('admin.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AddHoliday',
  props: {
    holidays: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      newHolidays: [],
      isValid: false,
    };
  },
  computed: {
    dateRules() {
      return [
        // eslint-disable-next-line
        v => !!v || 'Date is required',
        // eslint-disable-next-line
        v => this.validateDate(v) || 'Date already exists.',
      ];
    },
    nameRules() {
      return [
        // eslint-disable-next-line
        v => !!v || 'Name is required',
        // eslint-disable-next-line
        v => this.validateName(v) || 'Name already exists.',
      ];
    },
  },
  created() {
    this.addHoliday();
  },
  methods: {
    ...mapActions('element', ['upsertBulkRecords']),
    addHoliday() {
      this.newHolidays.push({
        name: '',
        date: '',
      });
    },
    removeHoliday(index) {
      this.newHolidays.splice(index, 1);
    },
    async onSubmit() {
      this.loading = true;
      const payload = {
        elementName: 'businessholidays',
        records: [...this.newHolidays, ...this.holidays],
      };
      await this.upsertBulkRecords(payload);
      this.closeDialog();
      this.$emit('added');
      this.$refs.form.reset();
      this.loading = false;
    },
    closeDialog() {
      this.dialog = false;
      this.newHolidays = [{
        name: '',
        date: '',
      }];
      this.$refs.form.reset();
    },
    validateName(v) {
      // eslint-disable-next-line
      for (let i = 0; i < this.holidays.length; i++) {
        if (this.holidays[i].name === v) {
          return false;
        }
      }
      return true;
    },
    validateDate(v) {
      // eslint-disable-next-line
      for (let i = 0; i < this.holidays.length; i++) {
        if (this.holidays[i].date === v) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
