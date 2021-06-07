<template>
  <component
    :is="component"
    :name="name"
    :colors="colors"
    :size="size"
  />
</template>

<script>
import AvatarBeam from './AvatarBeam.vue';
import AvatarBauhaus from './AvatarBauhaus.vue';
import AvatarPixel from './AvatarPixel.vue';
import AvatarRing from './AvatarRing.vue';

export default {
  name: 'Avatar',
  props: {
    variant: {
      type: String,
      default: 'beam',
      validator: (val) => [
        'beam',
        'bauhaus',
        'pixel',
        'ring',
      ].includes(val),
    },
    name: {
      type: String,
      default: 'name',
    },
    size: {
      type: Number,
      default: 36,
    },
    colors: {
      type: Array,
      default: () => [
        '#354493',
        '#21C77C',
        '#01C1E2',
        '#0172CA',
        '#2A2F36',
      ],
    },
  },
  components: {
    AvatarBeam,
    AvatarBauhaus,
    AvatarPixel,
    AvatarRing,
  },
  computed: {
    component() {
      return `avatar-${this.variant}`;
    },
  },
};
</script>
