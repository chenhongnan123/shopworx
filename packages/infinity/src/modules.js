import Vue from 'vue';
import ParameterConfiguration from '@shopworx/parameter-configuration';
import ParameterConfigurationMes from '@shopworx/parameter-configuration-mes';
import MaterialManagement from '@shopworx/material-management';
import Admin from '@shopworx/admin';
import Masters from '@shopworx/masters';
import ProductionPlanning from '@shopworx/production-planning';
import ProductionLog from '@shopworx/production-log';
import DowntimeLog from '@shopworx/downtime-log';
import RecipeManagement from '@shopworx/recipe-management';
import RoadmapManagement from '@shopworx/roadmap-management';
import PackagingManagement from '@shopworx/packaging-management';
import ProductionLayout from '@shopworx/production-layout';
import ProductionLayoutMes from '@shopworx/production-layout-mes';
import ProductManagement from '@shopworx/product-management';
import ReworkOperation from '@shopworx/rework-operation';
import DataVisualizer from '@shopworx/data-visualizer';
import TraceabilityApp from '@shopworx/traceability-app';
import NgCodeConfiguration from '@shopworx/ng-code-configuration';
import ProductionImage from '@shopworx/production-image';
import ReportViewer from '@shopworx/report-viewer';
import Setup from '@shopworx/setup';
import Spc from '@shopworx/spc';
import UserDashboard from '@shopworx/user-dashboard';
import OrderManagement from '@shopworx/order-management';
import ModelManagement from '@shopworx/model-management';
import store from './store';
import router from './router';
import i18n from './i18n';

Vue.use(ParameterConfiguration, {
  router,
  store,
  i18n,
});
Vue.use(ParameterConfigurationMes, {
  router,
  store,
  i18n,
});
Vue.use(DataVisualizer, {
  router,
  store,
  i18n,
});
Vue.use(MaterialManagement, {
  router,
  store,
  i18n,
});
Vue.use(Admin, {
  router,
  store,
  i18n,
});
Vue.use(TraceabilityApp, {
  router,
  store,
  i18n,
});
Vue.use(RoadmapManagement, {
  router,
  store,
  i18n,
});

Vue.use(PackagingManagement, {
  router,
  store,
  i18n,
});

Vue.use(ProductManagement, {
  router,
  store,
  i18n,
});
Vue.use(RecipeManagement, {
  router,
  store,
  i18n,
});
Vue.use(OrderManagement, {
  router,
  store,
  i18n,
});
Vue.use(Masters, {
  router,
  store,
  i18n,
});
Vue.use(ProductionPlanning, {
  router,
  store,
  i18n,
});
Vue.use(ProductionLog, {
  router,
  store,
  i18n,
});

Vue.use(DowntimeLog, {
  router,
  store,
  i18n,
});

Vue.use(ReportViewer, {
  router,
  store,
  i18n,
});
Vue.use(Setup, {
  router,
  store,
  i18n,
});
Vue.use(Spc, {
  router,
  store,
  i18n,
});
Vue.use(UserDashboard, {
  router,
  store,
  i18n,
});

Vue.use(NgCodeConfiguration, {
  router,
  store,
  i18n,
});

Vue.use(ReworkOperation, {
  router,
  store,
  i18n,
});

Vue.use(ProductionImage, {
  router,
  store,
  i18n,
});

Vue.use(ModelManagement, {
  router,
  store,
  i18n,
});

Vue.use(ProductionLayout, {
  router,
  store,
  i18n,
});
Vue.use(ProductionLayoutMes, {
  router,
  store,
  i18n,
});
