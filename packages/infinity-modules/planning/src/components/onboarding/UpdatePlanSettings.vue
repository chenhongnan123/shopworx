<template>
  <div>
    <span class="headline">
      {{ $t('setup.onboardCalendar.month.title') }}
    </span>
    <div v-if="fetching">
      {{ $t('setup.onboardCalendar.month.fetching') }}
    </div>

  </div>
</template>

<script>
export default {
  name: 'UpdatePlanSettings',
};
</script>
