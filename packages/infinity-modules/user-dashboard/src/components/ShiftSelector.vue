<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        small
        outlined
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-none ml-4"
      >
        {{ thisShift }}, {{ thisDate }}
      </v-btn>
    </template>
    <v-form v-model="isValid" @submit.prevent="apply">
      <v-card>
        <v-card-text>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                :label="$t('date')"
                outlined
                required
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :max="today"
              no-title
              scrollable
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
          <v-select
            :items="shifts"
            v-model="shift"
            :label="$t('shift')"
            outlined
            class="ml-8"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            class="text-none"
            @click="dialog = false"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            :disabled="!isValid || disableApply"
            class="text-none"
          >
            {{ $t('apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

export default {
  name: 'ShiftSelector',
  data() {
    return {
      shift: null,
      date: null,
      today: new Date().toISOString().substr(0, 10),
      menu: false,
      isValid: false,
      dialog: false,
    };
  },
  created() {
    const currentDate = this.formattedDate(this.currentDate.toString());
    this.shift = this.currentShift;
    this.date = currentDate;
    this.setFilters();
    this.getDashboardData();
  },
  computed: {
    ...mapState('userDashboard', [
      'thisShift',
      'thisDate',
      'previousShift',
      'previousDate',
      'currentShift',
      'currentDate',
    ]),
    ...mapGetters('userDashboard', ['shiftList']),
    shifts() {
      let shifts = [...this.shiftList];
      const currentDate = this.formattedDate(this.currentDate.toString());
      if (this.date === currentDate) {
        const currentIndex = shifts.findIndex((s) => s === this.currentShift);
        if (currentIndex > -1) {
          shifts = shifts.filter((s, i) => i <= currentIndex);
        }
      }
      return shifts;
    },
    disableApply() {
      const currentIndex = this.shifts.findIndex((s) => s === this.shift);
      return currentIndex < 0;
    },
  },
  methods: {
    ...mapMutations('userDashboard', [
      'setThisShift',
      'setThisDate',
      'setPreviousShift',
      'setPreviousDate',
    ]),
    ...mapActions('userDashboard', ['getDashboardData']),
    formattedDate(date) {
      const year = date.substring(0, 4);
      const month = date.substring(6, 4);
      const day = date.substring(8, 6);
      return `${year}-${month}-${day}`;
    },
    setFilters() {
      this.setThisDate(this.date);
      this.setThisShift(this.shift);
      const currentIndex = this.shiftList.findIndex((s) => s === this.shift);
      if (currentIndex === 0) {
        const newDate = new Date(this.date);
        newDate.setDate(newDate.getDate() - 1);
        const newShift = this.shiftList[this.shiftList.length - 1];
        this.setPreviousDate(newDate.toISOString().substr(0, 10));
        this.setPreviousShift(newShift);
      } else {
        this.setPreviousDate(this.date);
        this.setPreviousShift(this.shiftList[currentIndex - 1]);
      }
    },
    apply() {
      this.setFilters();
      this.getDashboardData();
      this.dialog = false;
    },
  },
};
</script>
