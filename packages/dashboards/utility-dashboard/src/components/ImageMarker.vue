<template>
  <div style="height: 100%">
    <div class="jcrop">
      <div
        v-for="(location, index) in locations"
        class="marklocation"
        :style="location.style"
        :key="index"
      >
        <v-btn
          elevation="2"
          color="white"
          class="close"
          x-small
          @click="remove(index)"
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
        <v-btn
          elevation="2"
          color="white"
          class="close"
          x-small
          style="margin-right: 38px"
          @click="openModel(index)"
        >
          <v-icon small>mdi-pencil-outline</v-icon>
        </v-btn>
        {{ location.name }}
      </div>
      <div v-if="requiredWidth" class="errormsg" :style="{top: styles.top, left: btnleft}">
        Please select the minimum area.
      </div>
      <template v-else>
      <v-btn
        v-if="showBtn"
        elevation="2"
        class="markbtn"
        color="white"
        x-small
        :style="{top: styles.top, left: btnleft}"
        @click="openModel"
      >
        <v-icon small>
          mdi-check
        </v-icon>
      </v-btn>
      </template>
      <Jcrop
        :src="imgurl"
        @update="updateCords"
        @change="showBtn = true"
        :rect="rect"
        :options="options"
      />
      <v-dialog
        v-model="showModal"
        scrollable
        persistent
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-text>
            <v-select
              :items="mappings"
              v-model="name"
              item-text="metername"
              item-value="metername"
              label="Select meter"
              required
            ></v-select>
            <v-select
              :items="fontSizes"
              v-model="fontSize"
              label="Font size*"
              required
            ></v-select>
            <p>* Realtime value of the meter will be displayed in the selected font size.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn @click="addLocation" color="primary" class="text-none">
                Map meter
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <div class="mask" v-show="showModal">
        <div class="modal-wrapper">
          <div class="form">
            <v-text-field
              label="Enter value"
              v-model="name"
              required
            ></v-text-field>
            <v-select
              :items="fontSizes"
              v-model="fontSize"
              label="Font size"
              required
            />
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { Jcrop } from 'vue-jcrop';
/* eslint-disable */
export default {
  name: 'ImageMarker',
  props: {
    imgurl: {
      type: String,
      required: true,
    },
    mappings: {
      type: Array,
      default: () => [],
    },
    areaMap: {
      type: Array,
      default: () => [],
    }
  },
  components: { Jcrop },
  data() {
    return {
      sel: {},
      map: {},
      name: '',
      styles: {},
      options: {},
      btnleft: 0,
      index: null,
      fontSize: 12,
      locations: [],
      showBtn: false,
      showModal: false,
      requiredWidth: false,
      rect: [10, 10, 100, 100],
      fontSizes: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30],
    };
  },
  mounted() {
    this.getImageInfo();
    if (this.areaMap) {
      this.locations = this.areaMap;
    }
  },
  methods: {
    getImageInfo() {
      const image = new Image();
      image.src = this.imgurl;
      this.map.width = image.width;
      this.map.height = image.height;
    },
    getColor(url, position) {
      const img = new Image();
      img.src = url;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, img.width, img.height);
      const rgb = context.getImageData(
        position.w / 2 + position.x,
        position.h / 2 + position.y,
        1,
        1,
      ).data;

      const color = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      return color >= 128 ? '#000000' : '#ffffff';
    },
    updateCords(e) {
      this.showBtn = false;
      if (!this.map.width) {
        this.getImageInfo();
      }
      this.sel = e.sel;
      this.styles.left = (e.sel.x / this.map.width) * 100 + '%';
      this.styles.top = (e.sel.y / this.map.height) * 100 + '%';
      this.styles.width = (e.sel.w / this.map.width) * 100 + '%';
      this.styles.height = (e.sel.h / this.map.height) * 100 + '%';
      this.btnleft = ((e.sel.w + e.sel.x) / this.map.width) * 100 + '%';

      if (e.sel.w < (this.map.width / 100) * 4 || e.sel.h < (this.map.width / 100) * 4) {
        this.requiredWidth = true;
      } else {
        this.requiredWidth = false;
      }
    },
    addLocation() {
      if (this.index >= 0) {
        console.log(this.fontSize / 16);
        this.locations[this.index].name = this.name;
        this.locations[this.index].style.fontSize = this.fontSize / 16 + 'vw';
      } else {
        this.styles.fontSize = this.fontSize / 16 + 'vw';
        const data = {
          name: this.name,
          style: this.styles,
        };
        this.locations.push(data);
      }
      this.styles = {};
      this.rect = [
        10,
        10,
        (this.map.width / 100) * 4,
        (this.map.width / 100) * 4,
      ];
      this.name = '';
      this.showModal = false;
      this.fontSize = 12;
      this.$emit('showBtn', true);
    },
    remove(i) {
      this.locations.splice(i, 1);
      if (!this.locations.length) {
        this.$emit('showBtn', false);
      }
    },
    openModel(i) {
      this.name = this.locations[i] ? this.locations[i].name : '';
      this.fontSize = this.locations[i]
        ? parseFloat(this.locations[i].style.fontSize.slice(0, -2)) * 16
        : 12;
      this.index = i;
      this.showModal = true;
      this.styles.color = this.getColor(this.imgurl, this.sel);
    },
  },
};
</script>

<style>
.jcrop {
  margin: 0 auto;
  position: relative
}
.jcrop img {
  width: 100%;
  height: auto;
}
.markbtn {
  z-index: 10;
  font-weight: bold;
  position: absolute;
  padding: 4px;
  margin: -22px 0px 0px -35px;
  display: flex;
}
.errormsg {
  background: #fff;
  color: red;
  font-size: 14px;
  border-radius: 6px;
  z-index: 10;
  position: absolute;
  padding: 2px 12px;
  margin: -27px 0px 0px -51px;
  display: flex;
}
.close {
  top: 0;
  right: 0;
  display: none;
  margin-top: -22px;
  margin-right: -1px;
  position: absolute;
  padding: 4px;
}
.marklocation {
  margin-top: -1px;
  margin-left: -1px;
  position: absolute;
  border: 1px solid #fff;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.marklocation:hover .close {
  display: inherit;
}
.mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.form {
  width: 300px;
  margin: 0px auto;
  border-radius: 12px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
</style>
