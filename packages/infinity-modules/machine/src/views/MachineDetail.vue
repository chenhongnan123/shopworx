<template>
  <div style="height:100%;">
    <portal to="app-header">
      <span v-text="$t('machine.machinedetail')"></span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0" style="height:100%;overflow: hidden;">
      <v-btn icon @click="$router.push({ name: 'machine' })" color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span v-text="`${$t('machine.name')} : `"> </span>
      <span v-text="machineInfo.machinename"></span>
      <v-row justify="center" style="height:25%;" class="px-6 mb-6 mt-1">
        <v-card style="width:100%;">
          <v-card-title primary-title style="background-color: #28abb9;color: white;" class="py-1">
            <v-icon color="white" class="mr-2">mdi-information</v-icon>
            {{ $t('machine.basic.title') }}
          </v-card-title>
          <v-card-text class="py-0 mt-5">
            <v-row justify="center">
              <v-col cols="1" class="align-self">
                <v-img
                  v-if="machinephoto"
                  class="elevation-3"
                  :src="machinephoto"
                  height="142"
                  aspect-ratio="0.6"
                ></v-img>
                <v-skeleton-loader
                  class="mx-auto"
                  height="142"
                  type="card"
                  v-else
                  elevation="3"
                ></v-skeleton-loader>
              </v-col>
              <v-col cols="10">
                <v-form readonly>
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        dense
                        :label="$t('machine.basic.id')"
                        v-model="machineInfo.id"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.name')"
                        v-model="machineInfo.machinename"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.description')"
                        v-model="machineInfo.description"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        dense
                        :label="$t('machine.basic.owner')"
                        v-model="machineInfo.owner"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.manufacturingdate')"
                        v-model="machineInfo.manufacturingdate"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.supplier')"
                        v-model="machineInfo.supplier"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        dense
                        :label="$t('machine.basic.weight')"
                        v-model="machineInfo.weight"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.size')"
                        v-model="machineInfo.size"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.voltage')"
                        v-model="machineInfo.voltage"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        dense
                        :label="$t('machine.basic.starttime')"
                        v-model="machineInfo.usagestartdate"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.oee')"
                        v-model="machineInfo.expectedoee"
                      ></v-text-field>
                      <v-text-field
                        dense
                        :label="$t('machine.basic.cycletime')"
                        v-model="machineInfo.expectedcycletime"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
              <v-col cols="1">
                <vue-qrcode :value="machineInfo.id" :margin="4" :scale="4" :quality="1" />
                <vue-qrcode
                  :value="machineInfo.id"
                  :margin="0"
                  :scale="20"
                  :quality="1"
                  id="qr"
                  v-show="false"
                />
                <v-btn small color="primary" block outlined class="text-none" @click="downloadQR">
                  <v-icon small left>mdi-download</v-icon>
                  {{ $t('machine.general.download') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row justify="center" style="height:47%;" class="px-6">
        <v-card style="width:100%;">
          <v-card-title primary-title style="background-color: #f05454;color: white;" class="py-1">
            <v-icon color="white" class="mr-2">mdi-cogs</v-icon>
            {{ $t('machine.position.title') }}
            <v-spacer></v-spacer>
            <v-btn
              small
              color="white"
              outlined
              class="text-none"
              @click="setAddMachinePositionDialog(true)"
            >
              <v-icon small left>mdi-plus</v-icon>
              {{ $t('machine.general.add') }}
            </v-btn>
          </v-card-title>
          <v-card-text class="py-0" style="height: calc(100% - 40px);">
            <v-row justify="center" class="mt-1" style="height: 100%;">
              <v-col cols="12">
                <v-tabs v-model="currenttab" height="24">
                  <v-tab v-for="item in positions" :key="item.id">
                    {{ item.name }}
                  </v-tab>
                </v-tabs>

                <v-tabs-items
                  class="position"
                  v-model="currenttab"
                  style="height: calc(100% - 24px);"
                >
                  <v-tab-item v-for="item in positions" :key="item.id" style="height: 100%;">
                    <v-row style="height: 100%;">
                      <v-col cols="1" class="align-self">
                        <v-img
                          v-if="item._photo"
                          :src="item._photo"
                          height="142"
                          aspect-ratio="0.6"
                          class="elevation-3"
                        ></v-img>
                        <v-skeleton-loader
                          class="mx-auto"
                          height="142"
                          type="card"
                          v-else
                          elevation="3"
                        ></v-skeleton-loader>
                      </v-col>
                      <v-col cols="2" class="align-self">
                        <v-form readonly>
                          <v-text-field
                            :label="$t('machine.position.id')"
                            v-model="item.id"
                          ></v-text-field>
                          <v-text-field
                            :label="$t('machine.position.name')"
                            v-model="item.name"
                          ></v-text-field>
                          <v-text-field
                            :label="$t('machine.position.description')"
                            v-model="item.description"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                      <v-col cols="9" style="height: 100%;" class="pt-0">
                        <v-row style="height: 15%;width: 100%;" class="py-0 mt-3">
                          <v-toolbar dense style="width: 60%;" outlined flat>
                            <v-toolbar-title>{{ $t('machine.sparepart.title') }}</v-toolbar-title>

                            <v-spacer></v-spacer>

                            <v-btn icon>
                              <v-icon @click="setBindSparepartDialog(true)">mdi-pencil</v-icon>
                            </v-btn>
                          </v-toolbar>
                        </v-row>
                        <v-row style="height: 85%;width: 100%;">
                          <v-sheet
                            class="mx-auto sps"
                            style="height: 100%;width: 100%;"
                            elevation="3"
                            color="#ebecf1"
                            outlined
                          >
                            <v-slide-group
                              v-model="model"
                              class="pa-4 align-self"
                              active-class="success"
                              show-arrows
                              style="height: 100%;"
                            >
                              <v-slide-item v-for="n in item.sparepartsinposition" :key="n._id">
                                <v-card class="ma-4" height="180" width="250">
                                  <v-row
                                    class="ma-0"
                                    style="height:100%;width: 100%;border-left: 10px solid #f05454;"
                                  >
                                    <v-col cols="5" class="pa-0">
                                      <v-img
                                        v-if="n._photo"
                                        :src="n._photo"
                                        height="100%"
                                        width="100%"
                                        elevation="3"
                                      ></v-img>
                                      <v-skeleton-loader
                                        class="mx-auto my-5"
                                        height="142"
                                        type="card"
                                        v-else
                                        elevation="3"
                                      ></v-skeleton-loader>
                                    </v-col>
                                    <v-col cols="7">
                                      <v-form class="pt-3" readonly>
                                        <v-text-field
                                          label="ID"
                                          dense
                                          v-model="n.id"
                                        ></v-text-field>
                                        <v-text-field
                                          label="Name"
                                          dense
                                          v-model="n.name"
                                        ></v-text-field>
                                        <v-text-field
                                          dense
                                          label="Description"
                                          v-model="n.description"
                                        ></v-text-field>
                                      </v-form>
                                    </v-col>
                                  </v-row>

                                  <!-- <v-row>
                                    <h1>{{ n.name }}</h1>
                                    <h1>{{ n.description }}</h1>
                                    <v-scale-transition>
                                      <v-icon
                                        v-if="active"
                                        color="white"
                                        size="48"
                                        v-text="'mdi-format-list-bulleted'"
                                      ></v-icon>
                                    </v-scale-transition>
                                  </v-row> -->
                                </v-card>
                              </v-slide-item>
                            </v-slide-group>
                          </v-sheet>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </v-card-text>
          <add-machine-position />
        </v-card>
      </v-row>
      <v-row justify="center" style="height:18%;">
        <v-col cols="6" class="pl-6">
          <v-card style="width:100%;height:100%;">
            <v-card-title
              dense
              primary-title
              style="background-color: #f5a25d;color: white;"
              class="py-1"
            >
              <v-icon color="white" class="mr-2">mdi-account-circle</v-icon>
              {{ $t('machine.operator.title') }}
              <v-spacer></v-spacer>
              <v-btn
                small
                color="white"
                outlined
                class="text-none"
                @click="setBindOperatorDialog(true)"
              >
                <v-icon small left>mdi-plus</v-icon>
                {{ $t('machine.general.add') }}
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0" style="height: calc(100% - 40px)">
              <v-sheet class="mx-auto" elevation="8" style="height: 100%;width: 100%;">
                <v-slide-group v-model="model" class="pa-0" active-class="success" show-arrows>
                  <v-slide-item v-for="n in operators" :key="n._id">
                    <v-card color="#ebecf1" class="ma-4" height="80" width="80">
                      <v-img
                        v-if="n._photo"
                        :src="n._photo"
                        height="56px"
                        width="56px"
                        style="margin: 2px 12px 0 12px;border-radius: 50%;"
                      ></v-img>
                      <v-icon
                        v-else
                        color="primary"
                        size="56"
                        style="margin: 2px 12px 0 12px;"
                        v-text="'mdi-account'"
                      ></v-icon>

                      <v-row justify="center">
                        {{ n.operatorname }}
                      </v-row>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" class="pr-6">
          <v-card style="width:100%;height:100%;">
            <v-card-title
              primary-title
              style="background-color: #59886b;color: white;"
              class="py-1"
            >
              <v-icon color="white" class="mr-2">mdi-file-document</v-icon>
              {{ $t('machine.document.title') }}
              <v-spacer></v-spacer>
              <v-btn
                small
                color="white"
                outlined
                class="text-none"
                @click="setAddDocumentDialog(true)"
              >
                <v-icon small left>mdi-plus</v-icon>
                {{ $t('machine.general.add') }}
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0" style="height: calc(100% - 40px)">
              <v-sheet class="mx-auto" elevation="8" style="height: 100%;width: 100%;">
                <v-slide-group v-model="model" class="pa-0" active-class="success" show-arrows>
                  <v-slide-item v-for="n in documentList" :key="n._id">
                    <v-card
                      color="#ebecf1"
                      class="ma-4"
                      height="80"
                      width="80"
                      @click="prevPDF(n.file, $event)"
                    >
                      <v-row align="center" justify="center">
                        <v-icon color="primary" size="56" v-text="'mdi-file-pdf'"></v-icon>
                      </v-row>
                      <v-row justify="center">
                        {{ n.name }}
                      </v-row>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <bind-sparepart />
    <bind-operator />
    <add-document />
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      max-width="100%"
      transition="dialog-transition"
    >
      <v-card color="primary" dark v-if="!pdf2prev">
        <v-card-text>
          {{ $t('machine.general.loading') }}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
      <v-card height="800px" v-else>
        <v-card-text>
          <pdf v-for="i in numPages" :src="pdf2prev" :key="i" :page="i" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            class="text-none"
            @click="
              dialog = false;
              pdf2prev = null;
            "
          >
            {{ $t('machine.general.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import VueQrcode from 'vue-qrcode';
import FileService from '@shopworx/services/api/file.service';
import pdf from 'vue-pdf';
import AddMachinePosition from '../components/AddMachinePosition.vue';
import BindSparepart from '../components/BindSparepart.vue';
import BindOperator from '../components/BindOperator.vue';
import AddDocument from '../components/AddDocument.vue';

export default {
  name: 'MachineDetail',
  data() {
    return {
      // tab: null,
      model: null,
      dialog: false,
      pdf2prev: null,
      currentPage: 0,
      numPages: 0,
      operators: [],
      positions: [],
      spareparts: [],
      machinephoto: null,
    };
  },
  components: {
    VueQrcode,
    AddMachinePosition,
    BindSparepart,
    BindOperator,
    AddDocument,
    pdf,
  },
  watch: {
    positions() {
      // this.setTab(0);
    },
    async operatorbindmachine() {
      const promiseList = this.operatorbindmachine
        // eslint-disable-next-line arrow-body-style
        .map((item) => {
          return new Promise((resolve) => {
            const { _id } = item;
            const info = this.operatorList.filter((operator) => operator.id === item.operatorid)[0];
            if (info.image) {
              const filelink = info.image;
              FileService.getInlineImage(filelink).then((response) => {
                const reader = new FileReader();
                reader.readAsDataURL(response.data);
                // eslint-disable-next-line arrow-body-style
                reader.onload = (event) => {
                  resolve({
                    bindid: _id,
                    ...item,
                    ...info,
                    _photo: event.target.result,
                  });
                };
              });
            } else {
              resolve({
                bindid: _id,
                ...item,
                ...info,
              });
            }
          });
        });
      const getData = await Promise.all(promiseList);
      this.operators = getData;
    },
    async positionList() {
      // eslint-disable-next-line arrow-body-style
      const promiseList = this.positionList.map((i) => {
        return new Promise((resolve) => {
          const { id, machineid } = i;
          if (i.image) {
            const filelink = i.image;
            FileService.getInlineImage(filelink).then((response) => {
              const reader = new FileReader();
              reader.readAsDataURL(response.data);
              // eslint-disable-next-line arrow-body-style
              reader.onload = (event) => {
                resolve({
                  ...i,
                  sparepartsinposition: this.sparepartbindposition
                    .filter((item) => item.machineid === machineid && item.machinepositionid === id)
                    // eslint-disable-next-line arrow-body-style
                    .map((item) => {
                      const { _id } = item;
                      return {
                        ...item,
                        ...this.spareparts.filter((part) => part.id === item.sparepartid)[0],
                        bindid: _id,
                      };
                    }),
                  _photo: event.target.result,
                });
              };
            });
          } else {
            resolve({
              ...i,
              sparepartsinposition: this.sparepartbindposition
                .filter((item) => item.machineid === machineid && item.machinepositionid === id)
                // eslint-disable-next-line arrow-body-style
                .map((item) => {
                  const { _id } = item;
                  return {
                    ...item,
                    ...this.spareparts.filter((part) => part.id === item.sparepartid)[0],
                    bindid: _id,
                  };
                }),
            });
          }
        });
      });
      const getData = await Promise.all(promiseList);
      this.positions = getData;
    },
    async sparepartList() {
      // eslint-disable-next-line arrow-body-style
      const promiseList = this.sparepartList.map((i) => {
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
      this.spareparts = getData;
    },
  },
  async created() {
    this.machineid = this.$route.params.id;
    this.currenttab = 0;

    await this.getSparepartRecords();
    await this.getSparepartbindpositionRecords(`?query=machineid=="${this.machineInfo.id}"`);
    await this.getDocumentRecords(`?query=machineid=="${this.machineInfo.id}"`);
    await this.getOperatorRecords();
    await this.getOperatorbindmachineRecords(`?query=machineid=="${this.machineInfo.id}"`);
    await this.getPositionRecords(`?query=machineid=="${this.machineInfo.id}"`);
    const filelink = this.machineList.filter((item) => item.id === this.machineid)[0].image;
    if (filelink) {
      FileService.getInlineImage(filelink).then((response) => {
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        // eslint-disable-next-line arrow-body-style
        reader.onload = (event) => {
          this.machinephoto = event.target.result;
        };
      });
    }
  },
  computed: {
    ...mapState('machine', [
      'positionList',
      'documentList',
      'machineList',
      'sparepartList',
      'sparepartbindposition',
      'tab',
      'operatorbindmachine',
      'operatorList',
    ]),
    ...mapState('auth', ['sessionId']),
    machineInfo: {
      get() {
        return this.machineList.filter((item) => item.id === this.machineid)[0];
      },
    },
    // positions() {
    //   const mapPosition = this.positionList.map((i) => {
    //     const { id, machineid } = i;
    //     return {
    //       ...i,
    //       sparepartsinposition: this.sparepartbindposition
    //         .filter((item) => item.machineid === machineid && item.machinepositionid === id)
    //         // eslint-disable-next-line arrow-body-style
    //         .map((item) => {
    //           const { _id } = item;
    //           return {
    //             ...item,
    //             ...this.sparepartList.filter((part) => part.id === item.sparepartid)[0],
    //             bindid: _id,
    //           };
    //         }),
    //     };
    //   });
    //   return mapPosition;
    // },
    // async operators() {

    // },
    currenttab: {
      get() {
        return this.tab;
      },
      set(val) {
        this.setTab(val);
      },
    },
  },
  methods: {
    ...mapMutations('machine', [
      'setAddMachinePositionDialog',
      'setBindSparepartDialog',
      'setTab',
      'setBindOperatorDialog',
      'setAddDocumentDialog',
    ]),
    ...mapActions('machine', [
      'getPositionRecords',
      'getDocumentRecords',
      'getSparepartRecords',
      'getSparepartbindpositionRecords',
      'getOperatorRecords',
      'getOperatorbindmachineRecords',
    ]),
    async prevPDF(filelink) {
      this.dialog = true;
      const response = await FileService.getInlineImage(filelink);
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = async (event) => {
        console.log(event);
        this.pdf2prev = event.target.result;

        const loadingTask = await pdf.createLoadingTask(this.pdf2prev).promise;
        this.numPages = loadingTask.numPages;
      };
    },
    downloadQR() {
      const qr = document.querySelector('#qr');
      const a = document.createElement('a');
      a.href = qr.src;
      a.download = 'QR.png';
      document.body.appendChild(a);
      a.click();
    },
  },
};
</script>
<style>
.tableHeader {
  background: gray;
  font-size: 22px;
}
.align-self {
  align-self: center;
}
.position .v-window__container {
  height: 100%;
}
.sps .v-slide-group .v-slide-group__content {
  align-self: center;
}
</style>
