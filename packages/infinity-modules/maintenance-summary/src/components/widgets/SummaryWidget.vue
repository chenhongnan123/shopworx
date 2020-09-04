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
      <v-card-text>
        <v-row>
          <v-col cols="7" class="py-0">
            <v-row v-if="currentParam != 4">
              <v-col cols="6">
                <div class="caption text-uppercase">
                  <span>
                    Plan
                  </span>
                </div>
                <div class="display-1 success--text">
                  {{ tabs[currentParam].plan }}
                </div>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <div class="caption text-uppercase">
                  <span>
                    Actual
                  </span>
                </div>
                <div class="display-1 info--text">
                  {{ tabs[currentParam].actual }}
                </div>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="6">
                <div class="caption text-uppercase">
                  <span>
                    Detected
                  </span>
                </div>
                <div class="display-1 success--text">
                  {{ tabs[currentParam].detected }}
                </div>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <div class="caption text-uppercase">
                  <span>
                    Corrected
                  </span>
                </div>
                <div class="display-1 info--text">
                  {{ tabs[currentParam].corrected }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" class="my-auto text-center py-0">
            <div class="caption text-uppercase">Adherence</div>
            <v-progress-circular
              size="120"
              width="15"
              :value="tabs[currentParam].adherence"
              :color="tabs[currentParam].adherence >= 80 ? 'success' : 'warning'"
              :rotate="270"
            >
              <span class="headline">
                {{ tabs[currentParam].adherence }}
              </span>
            </v-progress-circular>
          </v-col>
        </v-row>
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
            label="Select summary to display"
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
export default {
  name: 'SummaryWidget',
  data() {
    return {
      dialog: false,
      selectedParam: null,
      tabs: [
        {
          plan: 5,
          actual: 4,
          adherence: 80,
        },
        {
          plan: 27,
          actual: 21,
          adherence: 78,
        },
        {
          plan: 132,
          actual: 98,
          adherence: 74,
        },
        {
          plan: 860,
          actual: 734,
          adherence: 85,
        },
        {
          detected: 12,
          corrected: 10,
          adherence: 83,
        },
      ],
    };
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
  },
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
