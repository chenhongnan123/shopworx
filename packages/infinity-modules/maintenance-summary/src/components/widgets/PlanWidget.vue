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
        <v-row v-for="(plan, index) in tabs[currentParam].plans" :key="index">
          <v-col cols="4" class="title">
            {{ plan.part }}
          </v-col>
          <v-col cols="4" class="mt-1">
            {{ plan.machine }}
          </v-col>
          <v-col cols="4" class="mt-1">
            {{ plan.sapNo }}
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
            label="Select plans to display"
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
  name: 'PlanWidget',
  data() {
    return {
      dialog: false,
      selectedParam: null,
      tabs: [
        {
          plans: [
            {
              part: 'BIW SHOP',
              machine: 'AGV Conveyor',
              sapNo: 'SAP10',
            },
            {
              part: 'H-2',
              machine: 'Air Wash',
              sapNo: 'SAP4',
            },
            {
              part: 'CRANK SHAFT',
              machine: 'Abro Balancing',
              sapNo: 'SAP105',
            },
            {
              part: 'CRANK SHAFT',
              machine: 'Abro Balancing',
              sapNo: 'SAP105',
            },
            {
              part: 'UTILITY',
              machine: 'Air Compressor',
              sapNo: 'SAP45',
            },
          ],
        },
        {
          plans: [
            {
              part: 'MACHINING',
              machine: 'VNC-007',
              sapNo: 'SAP64',
            },
            {
              part: 'MACHINING',
              machine: 'HONING-002',
              sapNo: 'SAP109',
            },
            {
              part: 'UTILITY',
              machine: 'D.G. 3',
              sapNo: 'SAP48',
            },
          ],
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
