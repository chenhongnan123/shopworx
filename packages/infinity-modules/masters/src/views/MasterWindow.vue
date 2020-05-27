<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          color="primary"
          class="text-none"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          <v-icon
            left
            small
            v-text="'mdi-plus'"
          ></v-icon>
          Add new
          <v-icon small v-text="'mdi-chevron-down'" right></v-icon>
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          Refresh
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
        >
          <v-icon small v-text="'$download'" left></v-icon>
          Export
          <v-icon small v-text="'mdi-chevron-down'" right></v-icon>
        </v-btn>
      </span>
    </portal>
    <v-tabs
      v-if="showTabs(id)"
      v-model="tab"
      :background-color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-tab
        :key="asset.id"
        class="text-none"
        v-for="asset in getAssets(id)"
      >
        <span v-text="asset.assetDescription"></span>
      </v-tab>
      <v-tab-item
        :key="asset.id"
        v-for="asset in getAssets(id)"
      >
        <base-master
          :assetId="asset.id"
          :id="id"
        />
      </v-tab-item>
    </v-tabs>
    <base-master
      v-else
      :id="id"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BaseMaster from '../components/BaseMaster.vue';

export default {
  name: 'MasterWindow',
  components: {
    BaseMaster,
  },
  data() {
    return {
      tab: 0,
    };
  },
  computed: {
    ...mapGetters('masters', ['showTabs', 'getAssets']),
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
