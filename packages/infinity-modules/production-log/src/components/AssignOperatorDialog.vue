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
        style="margin-left: -16px"
      >
        Assign Operator
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">
            Assign operator - <span class="primary--text">{{ date }}</span>
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              :key="i"
              class="text-center"
              v-for="(shift, i) in shiftList"
            >
              <span v-if="i !== 0">
                {{ shift }}
              </span>
            </v-col>
          </v-row>
          <v-row
            :key="j"
            v-for="(machine, j) in machineList"
            :class="j != 0 ? 'mb-4': ''"
          >
            <v-col
              :key="k"
              v-for="(shift, k) in shiftList"
            >
              <div
                v-if="k == 0 && j !== 0"
                class="mt-2"
              >
                {{ machine }}
              </div>
              <span v-else-if="j !== 0">
                <v-combobox
                  dense
                  clearable
                  hide-details
                  hide-selected
                  :items="['a']"
                ></v-combobox>
              </span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'AssignOperatorDialog',
  data() {
    return {
      dialog: false,
      saving: false,
    };
  },
  computed: {
    ...mapGetters('productionLog', [
      'machineList',
      'shiftList',
    ]),
    ...mapState('productionLog', ['selectedDate']),
    date() {
      return this.selectedDate ? formatDate(new Date(this.selectedDate), 'PP') : '';
    },
  },
};
</script>
