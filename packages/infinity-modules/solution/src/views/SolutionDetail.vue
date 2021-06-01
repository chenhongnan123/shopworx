<template>
  <div id="solutiondetail" style="height: 100%;">
    <portal to="app-header">
      <span v-text="$t('solution.solutiondetail')"></span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0" style="height:100%;overflow: hidden;">
      <v-btn icon @click="$router.push({ name: 'solution' })" color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span v-text="`${$t('solution.name')} : `"> </span>
      <span v-text="solutionInfo.name ? solutionInfo.name : ''"></span>
      <v-row justify="center" style="height:15%;" class="px-6 mb-6 mt-1">
        <v-card style="width:100%;">
          <v-card-title primary-title style="background-color: #28abb9;color: white;" class="py-1">
            <v-icon color="white" class="mr-2">mdi-information</v-icon>
            {{ $t('solution.basic.title') }}
          </v-card-title>
          <v-card-text class="py-0">
            <v-form readonly>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    :label="$t('solution.basic.name')"
                    v-model="solutionInfo.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :label="$t('solution.basic.type')"
                    v-model="solutionInfo.type"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :label="$t('solution.basic.version')"
                    v-model="solutionInfo.version"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row justify="center" style="height:75%;" class="px-6 mb-6">
        <v-card style="width:100%;">
          <v-card-title primary-title style="background-color: #f05454;color: white;" class="py-1">
            <v-icon color="white" class="mr-2">mdi-format-list-numbered</v-icon>
            {{ $t('solution.detaillist.title') }}
            <v-spacer></v-spacer>
            <v-btn
              small
              color="white"
              outlined
              class="text-none"
              @click="setAddSolutionDetailDialog(true)"
            >
              <v-icon small left>mdi-plus</v-icon>
              {{ $t('solution.general.add') }}
            </v-btn>
          </v-card-title>
          <v-card-text class="py-0" style="height: calc(100% - 40px);overflow: auto;">
            <v-tabs dense v-model="tab" color="primary" slider-color="primary">
              <v-tab v-for="(value, name) in solutiondetails" :key="name">
                {{ name }}
              </v-tab>
            </v-tabs>
            <v-tabs-items id="solutiondetailtab" v-model="tab" style="height: calc(100% - 48px);">
              <v-tab-item
                v-for="(value, name) in solutiondetails"
                :key="name"
                style="height: 100%;"
              >
                <v-timeline
                  dense
                  class="solutiondetails"
                  :style="{ width: 420 * value.length + 'px', height: '100%' }"
                >
                  <v-timeline-item v-for="n in value" :key="n._id" icon="mdi-star" left>
                    <v-card class="elevation-2" height="100%">
                      <v-card-title class="headline">
                        {{ n.name }}
                        <v-spacer></v-spacer>
                        <v-chip
                          class="ml-0"
                          :color="n.type == 'attr' ? 'success' : 'error'"
                          outlined
                        >
                          {{ n.type }}
                        </v-chip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="#ff8585"
                              icon
                              v-bind="attrs"
                              v-on="on"
                              @click="
                                confirmDialog = true;
                                toDelete = n._id;
                              "
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('solution.general.delete') }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="#61b15a"
                              icon
                              v-bind="attrs"
                              v-on="on"
                              @click="
                                setAddSolutionDetailDialog(true);
                                putrecord = n;
                              "
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t('solution.general.edit') }}</span>
                        </v-tooltip>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text style="height: 220px;">
                        {{ n.description }}
                      </v-card-text>
                      <v-img
                        v-if="n._photo"
                        class="elevation-3 mx-auto"
                        width="250"
                        :src="n._photo"
                        height="170"
                      ></v-img>
                      <v-skeleton-loader
                        class="mx-auto"
                        elevation="3"
                        height="170"
                        width="250"
                        type="card"
                        v-else
                      ></v-skeleton-loader>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
          <add-solution-detail :putrecord="putrecord" />
        </v-card>
      </v-row>
    </v-container>
    <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
      <v-card>
        <v-card-title primary-title>
          <span> {{ $t('solution.general.confirmheader') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="confirmDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text> {{ $t('solution.general.confirmmessage') }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="text-none" :loading="saving" @click="deleteSolutionDetail">
            {{ $t('solution.general.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import _ from 'lodash';
import FileService from '@shopworx/services/api/file.service';
import AddSolutionDetail from '../components/AddSolutionDetail.vue';

export default {
  name: 'SolutionDetail',
  components: {
    AddSolutionDetail,
  },
  data() {
    return {
      show: false,
      solutiondetails: [],
      confirmDialog: false,
      toDelete: null,
      saving: false,
      putrecord: null,
      tab: null,
    };
  },
  watch: {
    solutionList() {
      this.solutionInfo = {
        ...this.solutionList.filter((item) => item.id === this.solutionid)[0],
      };
    },
    async solutiondetailList() {
      this.solutiondetails = [];
      // eslint-disable-next-line arrow-body-style
      const promiseList = this.solutiondetailList.map((i) => {
        return new Promise((resolve) => {
          if (i.image) {
            const filelink = i.image;
            FileService.getInlineImage(filelink).then((response) => {
              const reader = new FileReader();
              reader.readAsDataURL(response.data);
              // eslint-disable-next-line arrow-body-style
              reader.onload = (event) => {
                resolve({
                  ...i,
                  _photo: event.target.result,
                });
              };
            });
          } else {
            resolve({
              ...i,
            });
          }
        });
      });
      const getData = await Promise.all(promiseList);
      this.solutiondetails = _.groupBy(getData, 'group');
      this.tab = 0;
    },
    addSolutionDetailDialog(val) {
      if (!val) {
        this.putrecord = null;
      }
    },
  },
  computed: {
    ...mapState('auth', ['sessionId']),
    ...mapState('solution', ['solutionList', 'solutiondetailList', 'addSolutionDetailDialog']),
    solutionInfo: {
      get() {
        if (this.solutionList.filter((item) => item.id === this.solutionid).length > 0) {
          return this.solutionList.filter((item) => item.id === this.solutionid)[0];
        }
        return {
          name: '',
          type: '',
          description: '',
        };
      },
      set() {},
    },
  },
  async created() {
    this.solutionid = this.$route.params.id;
    if (this.solutionList.length < 1) {
      await this.getRecords();
    }
    await this.getSolutionDetailRecords(`?query=solutionid=="${this.solutionid}"`);
    await this.getSolutiondetailgroups();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('solution', ['setAddSolutionDetailDialog']),
    ...mapActions('solution', [
      'getSolutionDetailRecords',
      'getRecords',
      'deleteRecordById',
      'getSolutiondetailgroups',
    ]),
    async deleteSolutionDetail() {
      if (this.toDelete) {
        this.saving = true;
        const result = await this.deleteRecordById({
          id: this.toDelete,
          name: 'solutiondetail',
        });
        this.saving = false;
        if (result) {
          await this.getSolutionDetailRecords(`?query=solutionid=="${this.solutionInfo.id}"`);

          this.setAlert({
            show: true,
            type: 'success',
            message: 'DELETE_SOLUTION_DETAIL',
          });
        }
        this.confirmDialog = false;
      } else {
        this.confirmDialog = false;
      }
    },
  },
};
</script>
<style lang="sass">
.solutiondetails
    display: grid
    grid-template-rows: 500px
    grid-template-columns: repeat(auto-fill, 400px)
    gap: 20px
    &:before
      height: 2px
      width: 100%
      top: calc(48px - 1px)
      left: -10px!important
    &>.v-timeline-item
      position: relative
      display: block
      &>.v-timeline-item__body
        max-width: 100%
        top: 60px
        &>.v-card:before,&>.v-card:after
          transform: rotate(90deg)
          left: calc(50% - 10px)
          top: -16px
      &>.v-timeline-item__divider
        position: absolute
        top: 0
        left: calc(50% - 53px)
#solutiondetailtab>.v-window__container
  height: 100%
  padding-left: 2px
  overflow: auto
</style>
