<template>
  <div>
    <span class="headline">
      {{ $t('setup.onboardCalendar.month.title') }}
    </span>
    <div v-if="fetching">
      {{ $t('setup.onboardCalendar.month.fetching') }}
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
        :id="`month-${index}`"
        v-for="(month, index) in months"
        v-text="$t(`setup.onboardCalendar.month.${month}`)"
      ></v-chip>
    </v-chip-group>
    <v-btn
      block
      rounded
      @click="save"
      color="primary"
      id="finishMonth"
      class="text-none"
      :loading="loading"
    >
      <v-icon
        left
        v-text="'$skip'"
      ></v-icon>
      {{ $t('helper.next') }}
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
