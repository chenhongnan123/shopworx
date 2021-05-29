<template>
  <svg
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
  >
    <mask
      id="mask__beam"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      :width="SIZE"
      :height="SIZE"
    >
      <rect
        :width="SIZE"
        :height="SIZE"
        rx="20"
        fill="white"
      />
    </mask>
    <g mask="url(#mask__beam)" fill="transparent">
      <rect
        :width="SIZE"
        :height="SIZE"
        rx="20"
        :fill="properties.backgroundColor"
      />
      <rect
        x="0"
        y="0"
        :width="SIZE"
        :height="SIZE"
        :transform="transformRect"
        :fill="properties.wrapperColor"
        :rx="properties.isCircle ? SIZE : SIZE / 6"
      />
      <g :transform="transformG">
        <path
          v-if="properties.isMouthOpen"
          :d="openMouthPathD"
          :stroke="properties.faceColor"
          fill="none"
          strokeLinecap="round"
        />
        <path
          v-else
          :d="closedMouthPathD"
          :fill="properties.faceColor"
        />
        <rect
          :x="14 - properties.eyeSpread"
          y="14"
          width="1.5"
          height="2"
          rx="1"
          stroke="none"
          :fill="properties.faceColor"
        />
        <rect
          :x="20 + properties.eyeSpread"
          y="14"
          width="1.5"
          height="2"
          rx="1"
          stroke="none"
          :fill="properties.faceColor"
        />
      </g>
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
  getContrast,
} from '../utils/avatarUtils';

const SIZE = 36;

export default {
  name: 'AvatarBeam',
  props: ['name', 'colors', 'size'],
  data() {
    return {
      SIZE,
    };
  },
  computed: {
    properties() {
      const numFromName = getNumber(this.name);
      const range = this.colors && this.colors.length;
      const wrapperColor = getRandomColor(numFromName, this.colors, range);
      const preTranslateX = getUnit(numFromName, 10, 1);
      const wrapperTranslateX = preTranslateX < 5
        ? (preTranslateX + SIZE / 9)
        : preTranslateX;
      const preTranslateY = getUnit(numFromName, 10, 2);
      const wrapperTranslateY = preTranslateY < 5
        ? (preTranslateY + SIZE / 9)
        : preTranslateY;

      const data = {
        wrapperColor,
        faceColor: getContrast(wrapperColor),
        backgroundColor: getRandomColor(numFromName + 13, this.colors, range),
        wrapperTranslateX,
        wrapperTranslateY,
        wrapperRotate: getUnit(numFromName, 360),
        wrapperScale: (1 + (getUnit(numFromName, SIZE / 12) / 10)),
        isMouthOpen: getBoolean(numFromName, 2),
        isCircle: getBoolean(numFromName, 1),
        eyeSpread: getUnit(numFromName, 5),
        mouthSpread: getUnit(numFromName, 3),
        faceRotate: getUnit(numFromName, 10, 3),
        faceTranslateX: wrapperTranslateX > (SIZE / 6)
          ? wrapperTranslateX / 2
          : getUnit(numFromName, 8, 1),
        faceTranslateY: wrapperTranslateY > (SIZE / 6)
          ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2),
      };
      return data;
    },
    viewBox() {
      return `0 0 ${SIZE} ${SIZE}`;
    },
    transformRect() {
      return `
        translate(${this.properties.wrapperTranslateX} ${this.properties.wrapperTranslateY})
        rotate(${this.properties.wrapperRotate} ${SIZE / 2} ${SIZE / 2})
        scale(${this.properties.wrapperScale})
      `;
    },
    transformG() {
      return `
        translate(${this.properties.faceTranslateX} ${this.properties.faceTranslateY})
        rotate(${this.properties.faceRotate} ${SIZE / 2} ${SIZE / 2})
      `;
    },
    openMouthPathD() {
      return `M15 ${19 + this.properties.mouthSpread} c2 1 4 1 6 0`;
    },
    closedMouthPathD() {
      return `M13 ${19 + this.properties.mouthSpread} a1,0.75 0 0,0 10,0`;
    },
  },
};
</script>
