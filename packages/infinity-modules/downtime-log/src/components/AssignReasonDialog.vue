 <template>
<v-dialog v-model="dialog" max-width="700px">
    <template v-slot:activator="{ on }">
     <v-btn
        small
        outlined
        class="text-none"
        v-on="on"
     >
        Assign Reason
     </v-btn>
    </template>
    <v-form
    ref="form"
    lazy-validation>
    <v-card>
    <v-card-title>
        <span class="headline">Assign</span>
         <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-text>
     <v-data-table
      :headers="headers"
      :items="this.selectedItems"
      item-key="_id"
      hide-default-footer
      >
      <template v-slot:item="{ item }">
          <tr>
            <td>
                <v-checkbox
                v-model="item.selected"
                class="mx-2"
                @change="setCheckedItems(downtime)"
                ></v-checkbox>
            </td>
            <td>{{ item.machinename }}</td>
            <td>{{ item.shiftName }}</td>
            <td>
              {{new Date(item.downtimestart).toLocaleTimeString()}}
            </td>
            <td>
              {{new Date(item.downtimeend).toLocaleTimeString()}}
            </td>
            <td>{{ durationTime(item.downtimeduration) }}</td>
          </tr>
      </template>
     </v-data-table>
     <v-autocomplete
        dense
        outlined
        hide-details
        return-object
        :items="downtimeReasons"
        item-text="reasonname"
        item-value="reasonname"
        v-model="selectedReason"
      >
        <template #selection="data">
          {{ data.item.reasonname }}
        </template>
        <template #item="data">
          <v-list-item-content>
            <v-list-item-title>
              {{ data.item.reasonname }}
            </v-list-item-title>
            <v-list-item-subtitle
              v-text="data.item.category"
            ></v-list-item-subtitle>
            <v-list-item-subtitle
              v-text="data.item.department"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          @click="saveReasons"
          :loading="saving"
          > Save
        </v-btn>
    </v-card-actions>
    </v-card>
    </v-form>
</v-dialog>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'AssignReason',
  data() {
    return {
      dialog: false,
      saving: false,
      selectedReason: null,
      toggleHide: false,
      headers: [
        {
          text: 'Select',
          value: '',
        },
        {
          text: 'Machine',
          value: 'machinename',
        },
        {
          text: 'Shift',
          value: 'shiftName',
        },
        {
          text: 'StartTime',
          value: 'downtimestart',
        },
        {
          text: 'EndTime',
          value: 'downtimeend',
        },
        {
          text: 'Duration',
          value: 'downtimeduration',
        },
      ],
    };
  },
  computed: {
    ...mapState('downtimeLog', ['downtimeReasons', 'selectedItems', 'downtimeList']),
  },
  methods: {
    ...mapMutations('downtimeLog', [
      'setCheckedItems',
      'setToggleSelection',
    ]),
    ...mapActions('downtimeLog', ['updateReason']),
    durationTime(value) {
      let Time = 0;
      const d = value;
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      const viewTime = `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
      Time = viewTime;
      return Time;
    },
    async saveReasons() {
      this.saving = true;
      const payload = {
        reasonname: this.selectedReason.reasonname,
        reasoncode: this.selectedReason.reasoncode,
        category: this.selectedReason.category,
        department: this.selectedReason.department,
      };
      this.selectedItems.forEach(async (item) => {
        await this.updateReason(
          {
            // eslint-disable-next-line
            id: item._id,
            payload,
          },
        );
      });
      const unchecked = this.downtimeList.map((dt) => ({
        ...dt,
        selected: false,
      }));
      this.setCheckedItems(unchecked);
      this.setToggleSelection(this.toggleHide);
      this.saving = false;
      this.dialog = false;
    },
  },
};
</script>
