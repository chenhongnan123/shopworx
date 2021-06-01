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
        :rules="[(v) => !!v || 'Model name is required',
          (v) => (v && v.length <= 20) || 'Name must be less than 20 characters',
          (v) => !!v || 'Required', (v) => /^[a-z0-9]+([\s]{1}[a-z0-9]+)*$/i.test(v)
            || 'Invalid format(No Blank Space or special character)']"
        :counter="20"
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
        :rules="[(v) => (v.length <= 200) ||
           'Description must be less than 200 characters']"
        :counter="200"
      ></v-textarea>
      <v-autocomplete
            clearable
            class="ml-8"
            label="Select Model Type"
            :items="modelTypeList"
            return-object
            item-text="name"
            v-model="selectedModelType"
            :loading="loadingProducts"
            required
            >
            <template v-slot:item="{ item }">
                <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
            </template>
          </v-autocomplete>
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
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'ModelInfo',
  data() {
    return {
      name: '',
      description: '',
      selectedModelType: null,
      isValid: false,
      saving: false,
      savingAndClosing: false,
    };
  },
  async created() {
    await this.getModelTypeList();
  },
  computed: {
    ...mapState('modelManagement', [
      'models',
      'modelTypeList',
    ]),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement', ['createNewModel', 'getModelTypeList']),
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
      let flag = false;
      const checkNames = this.models.filter((f) => f.name === this.name);
      if (checkNames.length === 0) {
        let payload = {};
        if (this.selectedModelType) {
          payload = {
            modelname: this.name,
            modeldescription: this.description,
            modeltype: this.selectedModelType.name,
          };
          flag = this.createNewModel(payload);
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'MODEL_TYPE_REQUIRED',
          });
        }
      } else {
        flag = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MODEL_CREATE_NAME',
        });
      }
      return flag;
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
