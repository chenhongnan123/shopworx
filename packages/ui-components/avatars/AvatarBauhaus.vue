<template>
  <svg
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
  >
    <mask
      id="mask__bauhaus"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      :width="SIZE"
      :height="SIZE"
    >
      <rect
        :width="SIZE"
        :height="SIZE"
        :rx="SIZE / 2"
        fill="#fff"
      />
    </mask>
    <g mask="url(#mask__bauhaus)">
      <rect
        :width="SIZE"
        :height="SIZE"
        :rx="SIZE / 2"
        :fill="properties[0].color"
      />
      <rect
        :x="(SIZE - 60) / 2"
        :y="(SIZE - 20) / 2"
        :width="SIZE"
        :height="properties[1].isSquare ? SIZE : SIZE / 8"
        :fill="properties[1].color"
        :transform="transformRect"
      />
      <circle
        :cx="SIZE / 2"
        :cy="SIZE / 2"
        :fill="properties[2].color"
        :r="SIZE / 5"
        :transform="transformCircle"
        />
      <line
        x1="0"
        :y1="SIZE / 2"
        :x2="SIZE"
        :y2="SIZE / 2"
        strokeWidth="2"
        :stroke="properties[3].color"
        :transform="transformLine"
      />
    </g>
  </svg>
</template>

<script>
/*eslint-disable */
import {
  getNumber,
  getUnit,
  getBoolean,
  getRandomColor,
} from '../utils/avatarUtils';

const ELEMENTS = 4;
const SIZE = 80;

export default {
  name: 'AvatarBauhaus',
  props: ['name', 'colors', 'size'],
  data() {
    return {
      SIZE,
      ELEMENTS,
    };
  },
  computed: {
    properties() {
      const numFromName = getNumber(this.name);
      const range = this.colors && this.colors.length;

      const data = Array.from({length: ELEMENTS}, (_, i) => ({
        color: getRandomColor(numFromName + i, this.colors, range),
        translateX: getUnit(numFromName * (i + 1), (SIZE / 2 - (i + 17)), 1),
        translateY: getUnit(numFromName * (i + 1), (SIZE / 2 - (i + 17)), 2),
        rotate: getUnit(numFromName * (i + 1), 360),
        isSquare: getBoolean(numFromName, 2)
      }));
      return data;
    },
    viewBox() {
      return `0 0 ${SIZE} ${SIZE}`;
    },
    transformRect() {
      return `
        translate(${this.properties[1].translateX} ${this.properties[1].translateY})
        rotate(${this.properties[1].rotate} ${SIZE / 2} ${SIZE / 2})
      `;
    },
    transformCircle() {
      return `
        translate(${this.properties[2].translateX} ${this.properties[2].translateY})
      `;
    },
    transformLine() {
      return `
        translate(${this.properties[3].translateX} ${this.properties[3].translateY})
        rotate(${this.properties[3].rotate} ${SIZE / 2} ${SIZE / 2})
      `;
    },
  },
};
</script>
