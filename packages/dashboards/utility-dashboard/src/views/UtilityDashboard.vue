<template>
  <div>
    <v-container fluid style="height: 100%" class="grey lighten-5">
      <portal to="dashboard-title">
        Utility dashboard
      </portal>
      <portal to="dashboard-actions" v-if="showSaveButton">
        <v-btn
        class="text-none mr-2"
        color="primary"
        exact
        small
        outlined
        @click="saveData"
      >
        <v-icon left>mdi-content-save</v-icon>
        Save
      </v-btn>
      </portal>
      <portal to="dashboard-upload-layout">
        <div>
          <label for="file" style="cursor: pointer;">
            <v-icon left color="primary">mdi-cloud-upload-outline</v-icon>
            Upload layout
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            id="file"
            class="fileinput"
            @change="onChange"
          />
        </div>
      </portal>

      <div v-if="url">
        <image-marker :imgurl="url" @showBtn="showBtn" ref="marker"/>
      </div>

      <div class="d-flex justify-center align-center"
        style="min-height: 100vh; margin-top: -64px;"
        v-else
      >
        <div class="fileinput-box">
          <label
            class="inputlable"
            for="file"
          >
            <v-icon left color="primary">mdi-cloud-upload-outline</v-icon>
            Upload layout
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            id="file"
            class="fileinput"
            @change="onChange"
          />
        </div>
      </div>
    </v-container>
     <v-snackbar v-model="error" color="red darken-2" right>
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="error = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ImageMarker from '../components/ImageMarker.vue';

export default {
  name: 'UtilityDashboard',
  components: {
    ImageMarker,
  },
  data() {
    return {
      url: '',
      showSaveButton: false,
      error: false,
      snackbar: false,
      text: 'Please upload minimum (width 1024px) image.',
    };
  },
  created() {
    this.setShowHeaderButtons(false);
  },
  computed: {
    ...mapState('utilityDashboard', [
      'showSaveBtn',
    ]),
  },
  methods: {
    ...mapMutations('utilityDashboard', [
      'setShowSaveBtn',
    ]),
    ...mapMutations('helper', [
      'setShowHeaderButtons',
    ]),
    onChange(e) {
      this.url = '';
      const img = new Image();
      img.src = URL.createObjectURL(e.target.files[0]);
      img.onload = () => {
        if (img.width >= 1024) {
          this.url = URL.createObjectURL(e.target.files[0]);
        } else {
          this.error = true;
        }
      };
    },
    showBtn(value) {
      this.showSaveButton = value;
    },
    saveData() {
      console.log(this.$refs.marker.locations);
    },
  },
};
</script>

<style>
.fileinput {
  position: absolute;
  opacity: 0;
  height: 0;
}
.inputlable {
  color: #354493;
  display: flex;
  justify-content: center;
  align-content: center;
  cursor: pointer;
  padding: 20px;
}
.fileinput-box {
  width: 200px;
  border: 1px solid #354493;
  border-radius: 6px;
  margin-bottom: 30px;
}

</style>
