<template>
  <div id="cron">
    <portal to="app-header">
      <span>{{ $t('cronapp.name') }}</span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0">
      <div class="stick">
        <div style="float: right">
          <v-btn small color="primary" class="text-none" @click="setAddCronDialog(true)">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('cronapp.general.add') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('cronapp.general.refresh') }}
          </v-btn>
          <v-btn
            small
            color="error"
            outlined
            class="text-none ml-2"
            v-if="cronList.length && cronSelected.length"
            @click="confirmDialog = true"
          >
            <v-icon small left>mdi-delete</v-icon>
            {{ $t('cronapp.general.delete') }}
          </v-btn>
        </div>
      </div>
      <v-data-table
        v-model="cronSelected"
        :headers="headers"
        item-key="_id"
        :items="cronList"
        :options="{ itemsPerPage: 15 }"
        show-select
      >
        <template v-slot:item.name="props">
          <v-edit-dialog
            :return-value.sync="props.item.name"
            @save="saveTableParameter(props.item, 'name')"
          >
            {{ props.item.name }}
            <v-icon small color="primary" :disabled="false"> mdi-pencil </v-icon>
            <template v-slot:input>
              <v-text-field
                :disabled="false"
                v-model="props.item.name"
                label="Edit"
                single-line
                type="text"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.editedtime="props">
          <span>
            {{ props.item.editedtime ? format(props.item.editedtime, 'yyyy-MM-dd HH:mm:ss') : '' }}
          </span>
        </template>
        <template v-slot:item.createdtime="props">
          <span>{{ format(props.item.createdtime, 'yyyy-MM-dd HH:mm:ss') }}</span>
        </template>
      </v-data-table>
      <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title primary-title>
            <span> {{ $t('cronapp.general.confirmheader') }} </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="confirmDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text> {{ $t('cronapp.general.confirmmessage') }} </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="text-none" :loading="saving" @click="handleDeleteCron">
              {{ $t('cronapp.general.yes') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <add-cron />
  </div>
</template>

<script>
import { formatDate } from '@shopworx/services/util/date.service';
import { mapActions, mapMutations, mapState } from 'vuex';
import AddCron from '../components/AddCron.vue';

export default {
  components: { AddCron },
  name: 'Cron',
  data() {
    return {
      headers: [
        { text: this.$t('cronapp.header.name'), value: 'name' },
        { text: this.$t('cronapp.header.cron'), value: 'cron' },
        { text: this.$t('cronapp.header.editedtime'), value: 'editedtime' },
        { text: this.$t('cronapp.header.createdtime'), value: 'createdtime' },
      ],
      cronSelected: [],
      confirmDialog: false,
      saving: false,
      format: formatDate,
    };
  },
  computed: {
    ...mapState('cron', ['cronList']),
  },
  async created() {
    this.getRecords();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('cron', ['setAddCronDialog']),
    ...mapActions('cron', ['updateCron', 'deleteCron', 'createCron', 'getRecords']),
    async handleDeleteCron() {
      // eslint-disable-next-line max-len
      const results = await Promise.all(this.cronSelected.map((cron) => this.deleteCron(cron._id)));
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        await this.getRecords();

        this.saving = false;
        this.confirmDialog = false;
        this.cronSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete_cron',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'delete_cron',
        });
      }
    },
    async RefreshUI() {
      await this.getRecords();
    },
    async saveTableParameter(item, type) {
      console.log(item, type);
      const payload = {
        // editedby: this.userName,
        editedtime: new Date().getTime(),
      };
      if (!item[type]) {
        this.setAlert({
          show: true,
          type: 'error',
          message: `${type}_can_not_be_empty`,
        });
        await this.getRecords();
        return;
      }
      payload[type] = item[type];
      this.saving = true;
      const updateResult = await this.updateCron({ id: item._id, payload });
      this.saving = false;
      if (updateResult) {
        this.setAlert({
          show: true,
          type: 'success',
          message: `update_${type}`,
        });
      }
      await this.getRecords();
    },
  },
};
</script>
<style lang="sass">
#cron
  height: 100%
  width: 100%
  .stick
    width: 100%
    padding: 20px 0
    overflow: hidden
    z-index: 1
</style>
