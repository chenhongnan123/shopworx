 <template>
  <v-dialog
    v-model="dialog"
    max-width="700px"
    persistent
    scrollable
  >
    <template v-slot:activator="{ on }">
      <v-btn
        small
        v-on="on"
        class="text-none"
        color="primary"
      >
        <v-icon small left>mdi-playlist-check</v-icon>
        Assign Reason
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">Assign downtime reason</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="selectedDowntimes"
            item-key="_id"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.machinename }}</td>
                <td>{{ item.shiftName }}</td>
                <td>
                  {{ new Date(item.downtimestart).toLocaleTimeString() }}
                </td>
                <td v-if="item.status !== 'inProgress'">
                  {{ new Date(item.downtimeend).toLocaleTimeString() }}
                </td>
                <td v-else>
                  N.A
                </td>
                <td v-if="item.status !== 'inProgress'">
                  {{ duration(item.downtimeduration) }}
                </td>
                <td v-else>
                  Ongoing
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-autocomplete
            dense
            outlined
            hide-details
            return-object
            label="Reason"
            class="mt-4"
            :items="downtimeReasons"
            item-text="reasonname"
            item-value="reasonname"
            v-model="selectedReason"
            @change="checkSelection"
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
            :disabled="btnDisable"
            :loading="saving"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'AssignReasonDialog',
  data() {
    return {
      dialog: false,
      saving: false,
      selectedReason: null,
      btnDisable: false,
      toggleHide: false,
      downtimes: [],
      headers: [
        {
          text: 'Machine',
          value: 'machinename',
        },
        {
          text: 'Shift',
          value: 'shiftName',
        },
        {
          text: 'From',
          value: 'downtimestart',
        },
        {
          text: 'To',
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
    ...mapState('downtimeLog', [
      'downtimeReasons',
      'selectedDowntimes',
    ]),
  },
  created() {
    this.checkSelection();
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedDowntimes', 'setToggleSelection']),
    ...mapActions('downtimeLog', ['updateReason']),
    duration(value) {
      const d = value;
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      return `${h.toString().padStart(2, 0)}:${m
        .toString()
        .padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
    },
    checkSelection() {
      if (!this.selectedReason) {
        this.btnDisable = true;
      } else {
        this.btnDisable = false;
      }
    },
    async saveReasons() {
      this.saving = true;
      const payload = {
        reasonname: this.selectedReason.reasonname,
        reasoncode: this.selectedReason.reasoncode,
        category: this.selectedReason.category,
        department: this.selectedReason.department,
      };
      this.selectedDowntimes.forEach(async (item) => {
        await this.updateReason({
          // eslint-disable-next-line
          id: item._id,
          payload,
        });
      });
      this.setSelectedDowntimes([]);
      this.setToggleSelection(this.toggleHide);
      this.saving = false;
      this.dialog = false;
    },
  },
};
</script>
