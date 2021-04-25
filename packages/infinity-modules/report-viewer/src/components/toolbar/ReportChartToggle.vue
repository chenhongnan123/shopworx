<template>
  <v-btn
    small
    outlined
    color="primary"
    @click="setShowChart(!showChart)"
    class="text-none ml-2"
  >
    {{ showChart ? $t('hideChart') : $t('showChart') }}
  </v-btn>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ReportChartToggle',
  computed: {
    ...mapState('reports', ['showChart']),
  },
  methods: {
    ...mapMutations('reports', ['setShowChart']),
  },
};
</script>
