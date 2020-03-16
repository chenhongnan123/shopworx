<template>
  <div>
    <v-expansion-panels
      flat
      hover
      accordion
      v-model="panel"
    >
      <v-expansion-panel
        :key="index"
        :disabled="step.disabled || loading"
        v-for="(step, index) in formSteps"
      >
        <v-expansion-panel-header>
          <span>
            <v-icon v-text="step.icon"></v-icon>
            <span
              v-text="$t(step.title)"
              class="ml-2"
            ></span>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mt-1">
          <select-planning-tags
            v-if="index === 0"
            :masterTags="tags"
            :assetId="assetId"
            @tags-selected="onTagsSelected"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SelectPlanningTags from './planning/SelectPlanningTags.vue';

export default {
  name: 'PlanningSchema',
  components: {
    SelectPlanningTags,
  },
  props: {
    assetId: {
      type: Number,
      required: true,
    },
    element: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      panel: 0,
      loading: false,
      elementId: null,
      selectedTags: [],
    };
  },
  computed: {
    formSteps() {
      return [
        {
          title: `planning.onboarding.steps.${this.element.elementName}.matchColumns`,
          icon: 'mdi-database-settings',
          disabled: false,
        },
      ];
    },
  },
  methods: {
    ...mapActions('element', ['createElementAndTags']),
    ...mapActions('planning', ['getElements']),
    async onTagsSelected(data) {
      this.loading = true;
      this.tagsToProvision = data;
      const tagsCreated = await this.createElementAndTags({
        element: this.element,
        tags: this.tagsToProvision,
      });
      if (tagsCreated) {
        await this.getElements();
      }
      this.loading = false;
    },
  },
};
</script>
