<template>
  <div>
    <span class="headline">
      Select business's working days
    </span>
    <div v-if="fetching">
      Fetching working days...
    </div>
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
        v-text="day"
        v-for="(day, index) in days"
      ></v-chip>
    </v-chip-group>
    <v-btn
      block
      @click="save"
      color="primary"
      class="text-none"
      :loading="loading"
    >
      <v-icon left>mdi-skip-next-circle-outline</v-icon>
      Next
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'BusinessStartMonth',
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
      days: [
        'S',
        'M',
        'T',
        'W',
        'T',
        'F',
        'S',
      ],
      workingDays: [1, 2, 3, 4, 5, 6],
    };
  },
  computed: {
    masterDetails() {
      return this.master.find((m) => m.element.elementName.toLowerCase().trim() === 'businessworkingdays');
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
        this.workingDays = records
          .filter((rec) => rec.isWorking)
          .map((rec) => rec.day);
      }
      this.fetching = false;
    },
    save() {
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
        element: this.masterDetails.element,
        tags: this.masterDetails.tags,
        records,
      };
      this.$emit('save', payload);
    },
  },
};
</script>
