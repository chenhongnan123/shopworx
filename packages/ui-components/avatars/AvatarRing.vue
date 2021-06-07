<template>
  <svg
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
  >
    <path
      d="M90 45a45.001 45.001 0 00-76.82-31.82A45 45 0 000 45h90z"
      :fill="properties[0]"
    />
    <path
      d="M90 45a45.001 45.001 0 01-76.82 31.82A45 45 0 010 45h90z"
      :fill="properties[1]"
    />
    <path d="M83 45a38 38 0 00-76 0h76z" :fill="properties[2]" />
    <path d="M83 45a38 38 0 01-76 0h76z" :fill="properties[3]" />
    <path d="M77 45a32 32 0 10-64 0h64z" :fill="properties[4]" />
    <path d="M77 45a32 32 0 11-64 0h64z" :fill="properties[5]" />
    <path d="M71 45a26 26 0 00-52 0h52z" :fill="properties[6]" />
    <path d="M71 45a26 26 0 01-52 0h52z" :fill="properties[7]" />
    <circle cx="45" cy="45" r="23" :fill="properties[8]" />
  </svg>
</template>

<script>
/*eslint-disable */
import {
  getNumber,
  getRandomColor,
} from '../utils/avatarUtils';

const SIZE = 90;
const COLORS = 5;

export default {
  name: 'AvatarRing',
  props: ['name', 'colors', 'size'],
  data() {
    return {
      SIZE,
      COLORS,
    };
  },
  computed: {
    properties() {
      const numFromName = getNumber(this.name);
      const range = this.colors && this.colors.length;
      const colorsShuffle = Array.from({length: COLORS}, (_, i) => getRandomColor(numFromName + (i + 1), this.colors, range));
      const iconColors = [];
      iconColors[0] = colorsShuffle[0];
      iconColors[1] = colorsShuffle[1];
      iconColors[2] = colorsShuffle[1];
      iconColors[3] = colorsShuffle[2];
      iconColors[4] = colorsShuffle[2];
      iconColors[5] = colorsShuffle[3];
      iconColors[6] = colorsShuffle[3];
      iconColors[7] = colorsShuffle[0];
      iconColors[8] = colorsShuffle[4];

      return iconColors;
    },
    viewBox() {
      return `0 0 ${SIZE} ${SIZE}`;
    },
  },
};
</script>
