<template>
  <v-form ref="form" v-model="isValid">
    <v-card-text>
      <v-text-field
        dense
        outlined
        v-model="name"
        label="Model name*"
        prepend-icon="mdi-memory"
        :disabled="saving || savingAndClosing"
        :rules="[v => !!v || 'Model name is required']"
      ></v-text-field>
      <v-textarea
        dense
        rows="3"
        outlined
        single-line
        class="ml-8"
        v-model="description"
        label="Model description goes here"
        :disabled="saving || savingAndClosing"
      ></v-textarea>
      <div class="caption">*Required field</div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        text
        :disabled="saving || savingAndClosing"
        class="text-none"
        @click="cancel"
      >
        Exit
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        class="text-none"
        :disabled="saving || !isValid"
        @click="saveAndExit"
        :loading="savingAndClosing"
      >
        Save & exit
      </v-btn>
      <v-btn
        color="primary"
        :loading="saving"
        class="text-none"
        @click="saveAndContinue"
        :disabled="savingAndClosing || !isValid"
      >
        Save & continue
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ModelInfo',
  data() {
    return {
      name: '',
      description: '',
      isValid: false,
      saving: false,
      savingAndClosing: false,
    };
  },
  methods: {
    ...mapActions('modelManagement', ['createNewModel']),
    clear() {
      this.name = '';
      this.description = '';
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    cancel() {
      this.clear();
      this.$emit('on-cancel');
    },
    async createModel() {
      const payload = {
        modelname: this.name,
        modeldescription: this.description,
      };
      return this.createNewModel(payload);
    },
    async saveAndExit() {
      if (this.isValid) {
        this.savingAndClosing = true;
        const created = await this.createModel();
        if (created) {
          this.cancel();
        }
        this.savingAndClosing = false;
      }
    },
    async saveAndContinue() {
      if (this.isValid) {
        this.saving = true;
        const created = await this.createModel();
        if (created) {
          this.clear();
          this.$emit('on-save');
        }
        this.saving = false;
      }
    },
  },
};
</script>
