<template>
  <div v-if="widget">
    <span
      class="title font-weight-regular"
      v-if="title"
      v-text="title"
    ></span>
    <span class="float-right">
      <v-btn small icon v-if="config" @click="dialog = true">
        <v-icon small v-text="'$settings'"></v-icon>
      </v-btn>
      <v-btn
        small
        color="error"
        icon
        v-if="customizeMode"
        @click="$emit('remove-widget', widget.i)"
      >
        <v-icon>mdi-minus-circle</v-icon>
      </v-btn>
    </span>
    <v-card
      v-if="isConfigured"
      :class="title === null ? 'mt-8' : ''"
    >
      <v-card-text v-if="streamData && streamData.length">
        <div
          :key="index"
          class="error--text"
          v-for="(data, index) in streamData"
        >
          {{ data }}
        </div>
      </v-card-text>
    <v-card-text v-else>
      <v-container fill-height>
        <v-row
          align="center"
          justify="center"
          :no-gutters="$vuetify.breakpoint.smAndDown"
        >
          <v-col cols="12" align="center">
            <span class="headline">
              No {{ title }} for {{ machine }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-text class="text-center my-auto">
        <div>
          <v-icon x-large color="primary" v-text="'$settings'"></v-icon>
        </div>
        <v-btn
          outlined
          @click="dialog = true"
          color="primary"
          class="text-none mt-4"
        >
          Configure widget
        </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Configure widget
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            filled
            item-text="title"
            item-value="val"
            :items="allParameters"
            v-model="selectedParam"
            label="Select text stream to display"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="saveConfig"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'StatusWidget',
  props: {
    widget: {
      type: Object,
      default: null,
    },
    customizeMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedParam: null,
      dialog: false,
    };
  },
  created() {
    this.selectedParam = this.currentParam;
  },
  watch: {
    currentParam(val) {
      this.selectedParam = val;
    },
  },
  computed: {
    config() {
      return this.widget && this.widget.definition.config;
    },
    isConfigured() {
      return this.widget && this.widget.definition.configured;
    },
    currentParam() {
      return this.config && this.config.selectedParameter;
    },
    allParameters() {
      return this.config && this.config.availableParameters;
    },
    title() {
      if (this.config) {
        if (this.isConfigured) {
          const param = this.config.availableParameters[this.config.selectedParameter];
          return param.title;
        }
        return this.widget.definition.title;
      }
      return null;
    },
    values() {
      if (this.config) {
        if (this.isConfigured) {
          const param = this.config.availableParameters[this.config.selectedParameter];
          return param.values;
        }
      }
      return [];
    },
    machine() {
      return this.$route.params.id;
    },
    ...mapState('machineDashboard', ['assetData']),
    assetState() {
      return this.assetData && this.assetData[this.machine];
    },
    streamData() {
      let data = [];
      if (this.values && this.values.length) {
        data = this.values
          .filter((value) => this.assetState && this.assetState[value.key])
          .map((value) => value.text.replace(`##${value.val}##`, this.assetState[value.val]));
      }
      return data;
    },
  },
  methods: {
    saveConfig() {
      const payload = {
        config: {
          availableParameters: this.allParameters,
          selectedParameter: this.selectedParam,
        },
        configured: true,
      };
      this.$emit('save-config', payload);
      this.dialog = false;
    },
  },
};
</script>
