<template>
    <v-dialog id="setting" v-model="settingDialog" persistent scrollable
      max-width="500px"
      transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          <span>
             Spc Setting
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="setSettingDialog(false)" v-if="spcSetting != null ">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text  style="height: 810px;">
          <v-form ref="form" v-model="valid" lazy-validation class="mt-2">
            <v-text-field
            label="Refresh Timer (s)"
            outlined
            v-model="setting.refresh"
            :rules="rules.refresh"
            type="number"
          ></v-text-field>
          <v-text-field
            label="CpK Sample Size"
            outlined
            type="number"
            v-model="setting.cpksamplesize"
            :rules="rules.cpksamplesize"
          ></v-text-field>
          <v-text-field
            label="PpK Sample Size"
            outlined
            type="number"
            v-model="setting.ppksamplesize"
            :rules="rules.ppksamplesize"
          ></v-text-field>
          <v-text-field
            label="I Chart Sample Size"
            outlined
            type="number"
            v-model="setting.isamplesize"
            :rules="rules.isamplesize"
          ></v-text-field>
          <v-text-field
            label=" MR Chart Sample Size"
            outlined
            type="number"
            v-model="setting.mrsamplesize"
            :rules="rules.mrsamplesize"
          ></v-text-field>
           <v-text-field
            label="Xbar-R Chart Group Size"
            outlined
            type="number"
            v-model="setting.xbarrgroupsize"
            :rules="rules.xbarrgroupsize"
          ></v-text-field>
          <v-text-field
            label="Xbar-R Chart Sample Size"
            outlined
            type="number"
            v-model="setting.xbarrsamplesize"
            :rules="rules.xbarrsamplesize"
          ></v-text-field>
          <v-text-field
            label="Xbar-S Chart Group Size"
            outlined
            type="number"
            v-model="setting.xbarsgroupsize"
            :rules="rules.xbarsgroupsize"
          ></v-text-field>
           <v-text-field
            label="Xbar-S Chart Sample Size"
            outlined
            type="number"
            v-model="setting.xbarssamplesize"
            :rules="rules.xbarssamplesize"
          ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="text-none"
            :disabled="!valid"
            @click="saveSetting"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'SettingWindow',
  data() {
    return {
      valid: false,
      rules: {
        refresh: [(v) => !!v || 'Refresh Timer is required',
          (v) => /^[1-9]\d*$/.test(Number(v)) || 'Please input integer bigger than 0 !',
        ],
        cpksamplesize: [(v) => !!v || 'CpK Sample Size is required',
          (v) => /^[1-9]\d*$/.test(Number(v)) || 'Please input integer bigger than 0 !',
        ],
        ppksamplesize: [(v) => !!v || 'PpK Sample Size is required',
          (v) => /^[1-9]\d*$/.test(Number(v)) || 'Please input integer bigger than 0 !',
        ],
        isamplesize: [(v) => !!v || 'I-Chart Sample Size is required',
          (v) => (/^[1-9]\d*$/.test(Number(v)) && Number(v) > 2) || 'Please input integer bigger than 2 !',
        ],
        mrsamplesize: [(v) => !!v || 'MR-Chart Sample Size is required',
          (v) => (/^[1-9]\d*$/.test(Number(v)) && Number(v) > 2) || 'Please input integer bigger than 2 !',
        ],
        xbarrsamplesize: [(v) => !!v || 'Xbar-R-Chart Sample Size is required',
          (v) => /^[1-9]\d*$/.test(Number(v)) || 'Please input integer bigger than 0 !',
        ],
        xbarrgroupsize: [(v) => !!v || 'Xbar-R-Chart Group Size is required',
          (v) => /^[1-9]\d*$/.test(Number(v)) || 'Please input integer bigger than 0 !',
        ],
        xbarssamplesize: [(v) => !!v || 'Xbar-S-Chart Sample Size is required',
          (v) => /^[1-9]\d*$/.test(Number(v)) || 'Please input integer bigger than 0 !',
        ],
        xbarsgroupsize: [(v) => !!v || 'Xbar-S-Chart Group Size is required',
          (v) => /^[1-9]\d*$/.test(Number(v)) || 'Please input integer bigger than 0 !',
        ],
      },
    };
  },
  computed: {
    ...mapState('spc', ['settingDialog', 'spcSetting']),
    setting() {
      return { ...this.spcSetting };
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('spc', ['setSettingDialog', 'setSpcSetting']),
    saveSetting() {
      const { setting } = this;
      const {
        xbarrgroupsize,
        xbarrsamplesize,
        xbarsgroupsize,
        xbarssamplesize,
      } = setting;
      if (Number(xbarrsamplesize) % Number(xbarrgroupsize) > 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Xbar-r sample size should be an integer multiple of Xbar-r group size ',
        });
        return;
      }
      if (Number(xbarssamplesize) % Number(xbarsgroupsize) > 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'Xbar-r sample size should be an integer multiple of Xbar-r group size ',
        });
        return;
      }
      Object.keys(setting).forEach((k) => {
        setting[k] = Number(setting[k]);
      });
      localStorage.setItem('spcSetting', JSON.stringify(setting));
      this.setSpcSetting(setting);
      this.setSettingDialog(false);
      this.setAlert({
        show: true,
        type: 'success',
        message: 'Setting Saved',
      });
    },
  },
  mounted() {
    if (this.$refs.form) {
      this.$refs.form.validate();
    }
  },
};
</script>
