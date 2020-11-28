<template>
  <tr>
    <td>
      {{ production.planid }}
    </td>
    <td class="truncate" :title="production.partname">
      {{ production.partname }}
    </td>
    <td>
      {{ new Date(production.firstcycle).toLocaleTimeString('en-GB') }}
    </td>
    <td>
      {{ new Date(production.lastcycle).toLocaleTimeString('en-GB') }}
    </td>
    <td>
      <span class="info--text">
        {{ production.produced }}
      </span>
    </td>
    <td>
      <span class="success--text">
        {{ production.accepted }}
      </span>
    </td>
    <td>
      <div class="error--text d-inline-block mt-1">
        {{ production.rejected }}
      </div>
      <span class="float-right">
        <assign-rejections :production="production" />
      </span>
    </td>
    <td>
      <div class="warning--text d-inline-block mt-1">
        {{ production.rework }}
      </div>
      <span class="float-right">
        <assign-rework :production="production" />
      </span>
    </td>
    <td>
      <div class="warning--text d-inline-block mt-1">
        {{ parseFloat(production.scrap).toFixed(2) }}
      </div>
      <span class="float-right">
        <assign-scrap :production="production" />
      </span>
    </td>
  </tr>
</template>

<script>
import AssignRejections from './AssignRejections.vue';
import AssignRework from './AssignRework.vue';
import AssignScrap from './AssignScrap.vue';

export default {
  name: 'ProductionListItem',
  components: {
    AssignRejections,
    AssignRework,
    AssignScrap,
  },
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.truncate {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
