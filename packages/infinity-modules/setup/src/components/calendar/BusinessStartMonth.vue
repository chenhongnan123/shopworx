<template>
  <div>
    <span class="headline">
      Select business's month start
    </span>
    <div v-if="fetching">
      Fetching month start...
    </div>
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
        v-text="month"
        v-for="(month, index) in months"
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
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      monthStart: 0,
    };
  },
  computed: {
    masterDetails() {
      return this.master.find((m) => m.element.elementName.toLowerCase().trim() === 'businessyear');
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
        const [tag] = this.masterDetails.tags;
        this.monthStart = records[0][tag.tagName];
      }
      this.fetching = false;
    },
    save() {
      const [tag] = this.masterDetails.tags;
      const payload = {
        element: this.masterDetails.element,
        tags: this.masterDetails.tags,
        record: {
          [tag.tagName]: this.monthStart,
        },
      };
      this.$emit('save', payload);
    },
  },
};
</script>
