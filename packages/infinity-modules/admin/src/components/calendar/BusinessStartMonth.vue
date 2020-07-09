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
    <v-chip-group
      v-else
      column
      mandatory
      class="my-2"
      v-model="monthStart"
      active-class="primary"
    >
      <v-chip
        large
        :key="index"
        :id="`month-${index}`"
        v-for="(month, index) in months"
        v-text="$t(`setup.onboardCalendar.month.${month}`)"
      ></v-chip>
    </v-chip-group>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'BusinessStartMonth',
  data() {
    return {
      loading: false,
      saving: false,
      months: [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ],
      monthStart: 0,
    };
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapActions('element', ['getRecords', 'upsertRecord']),
    async fetchRecords() {
      this.loading = true;
      const records = await this.getRecords({
        elementName: 'businessyear',
      });
      if (records && records.length) {
        this.monthStart = records[0].startmonth - 1;
      }
      this.loading = false;
    },
    async save() {
      this.saving = true;
      const payload = {
        elementName: 'businessyear',
        record: {
          startmonth: this.monthStart + 1,
        },
      };
      await this.upsertRecord(payload);
      this.saving = false;
    },
  },
};
</script>
