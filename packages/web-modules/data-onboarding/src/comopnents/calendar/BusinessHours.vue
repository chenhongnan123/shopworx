<template>
  <div>
    <v-row v-for="(rountine, index) in routines" :key="index">
      <v-col cols="12" md="3">
        <v-select
          outlined
          v-model="rountine.type"
          :items="['Shift', 'Break']"
          hide-details
          label="Name"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          outlined
          v-model="rountine.name"
          hide-details
          placeholder="Shift name / break name"
          type="text"
          label="Name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          outlined
          v-model="rountine.starttime"
          hide-details
          type="text"
          placeholder="08:00"
          label="Start time"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          outlined
          v-model="rountine.endtime"
          hide-details
          type="text"
          placeholder="14:00"
          label="End time"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn icon class="mt-2 mx-2" @click="addRoutine">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
        <v-btn icon class="mt-2 mx-2" @click="removeRoutine(index)" :disabled="index === 0">
          <v-icon>mdi-minus-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'BusinessHours',
  data() {
    return {
      routines: [{
        type: 'Shift',
        name: 'Shift 1',
        starttime: '08:00',
        endtime: '14:00',
      }],
    };
  },
  methods: {
    addRoutine() {
      this.routines.push({
        type: 'Shift',
        name: null,
        starttime: null,
        endtime: null,
      });
    },
    removeRoutine(index) {
      this.routines.splice(index, 1);
    },
  },
};
</script>
