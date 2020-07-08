import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    customizeMode: false,
    allWidgets: [
      {
        component: 'summary-widget',
        title: 'PM Summary visualization',
        maxCount: 10,
        minWidth: 3,
        minHeight: 3,
        maxWidth: 4,
        maxHeight: 5,
        config: {
          availableParameters: [
            {
              title: 'Yesterday Adherence',
              val: 0,
            },
            {
              title: 'Daily number of points',
              val: 1,
            },
            {
              title: 'Number of machines',
              val: 2,
            },
            {
              title: 'Number of points',
              val: 3,
            },
            {
              title: 'Abnormality',
              val: 4,
            },
          ],
          selectedParameter: null,
        },
        configured: false,
      },
      {
        component: 'plan-widget',
        title: 'PM Plan',
        maxCount: 10,
        minWidth: 3,
        minHeight: 3,
        maxWidth: 4,
        maxHeight: 10,
        config: {
          availableParameters: [
            {
              title: 'This week\'s plan',
              val: 0,
            },
            {
              title: 'Next week\'s plan',
              val: 1,
            },
          ],
          selectedParameter: null,
        },
        configured: false,
      },
    ],
    widgets: [
      {
        x: 0,
        y: 0,
        w: 4,
        h: 5,
        i: 0,
        definition: {
          component: 'summary-widget',
          title: 'PM Summary visualization',
          maxCount: 10,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 5,
          config: {
            availableParameters: [
              {
                title: 'Yesterday Adherence',
                val: 0,
              },
              {
                title: 'Daily number of points',
                val: 1,
              },
              {
                title: 'Number of machines',
                val: 2,
              },
              {
                title: 'Number of points',
                val: 3,
              },
              {
                title: 'Abnormality',
                val: 4,
              },
            ],
            selectedParameter: 0,
          },
          configured: true,
        },
        moved: false,
      },
      {
        x: 4,
        y: 0,
        w: 4,
        h: 5,
        i: 1,
        definition: {
          component: 'summary-widget',
          title: 'PM Summary visualization',
          maxCount: 10,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 5,
          config: {
            availableParameters: [
              {
                title: 'Yesterday Adherence',
                val: 0,
              },
              {
                title: 'Daily number of points',
                val: 1,
              },
              {
                title: 'Number of machines',
                val: 2,
              },
              {
                title: 'Number of points',
                val: 3,
              },
              {
                title: 'Abnormality',
                val: 4,
              },
            ],
            selectedParameter: 1,
          },
          configured: true,
        },
        moved: false,
      },
      {
        x: 8,
        y: 0,
        w: 4,
        h: 5,
        i: 2,
        definition: {
          component: 'summary-widget',
          title: 'PM Summary visualization',
          maxCount: 10,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 5,
          config: {
            availableParameters: [
              {
                title: 'Yesterday Adherence',
                val: 0,
              },
              {
                title: 'Daily number of points',
                val: 1,
              },
              {
                title: 'Number of machines',
                val: 2,
              },
              {
                title: 'Number of points',
                val: 3,
              },
              {
                title: 'Abnormality',
                val: 4,
              },
            ],
            selectedParameter: 2,
          },
          configured: true,
        },
        moved: false,
      },
      {
        x: 0,
        y: 5,
        w: 4,
        h: 10,
        i: 3,
        definition: {
          component: 'plan-widget',
          title: 'PM Plan',
          maxCount: 10,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 10,
          config: {
            availableParameters: [
              {
                title: 'This week\'s plan',
                val: 0,
              },
              {
                title: 'Next week\'s plan',
                val: 1,
              },
            ],
            selectedParameter: 0,
          },
          configured: true,
        },
        moved: false,
      },
      {
        x: 4,
        y: 5,
        w: 4,
        h: 10,
        i: 4,
        definition: {
          component: 'plan-widget',
          title: 'PM Plan',
          maxCount: 10,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 10,
          config: {
            availableParameters: [
              {
                title: 'This week\'s plan',
                val: 0,
              },
              {
                title: 'Next week\'s plan',
                val: 1,
              },
            ],
            selectedParameter: 1,
          },
          configured: true,
        },
        moved: false,
      },
      {
        x: 8,
        y: 5,
        w: 4,
        h: 5,
        i: 5,
        definition: {
          component: 'summary-widget',
          title: 'PM Summary visualization',
          maxCount: 10,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 5,
          config: {
            availableParameters: [
              {
                title: 'Yesterday Adherence',
                val: 0,
              },
              {
                title: 'Daily number of points',
                val: 1,
              },
              {
                title: 'Number of machines',
                val: 2,
              },
              {
                title: 'Number of points',
                val: 3,
              },
              {
                title: 'Abnormality',
                val: 4,
              },
            ],
            selectedParameter: 3,
          },
          configured: true,
        },
        moved: false,
      },
      {
        x: 8,
        y: 10,
        w: 4,
        h: 5,
        i: 6,
        definition: {
          component: 'summary-widget',
          title: 'PM Summary visualization',
          maxCount: 10,
          minWidth: 3,
          minHeight: 3,
          maxWidth: 4,
          maxHeight: 5,
          config: {
            availableParameters: [
              {
                title: 'Yesterday Adherence',
                val: 0,
              },
              {
                title: 'Daily number of points',
                val: 1,
              },
              {
                title: 'Number of machines',
                val: 2,
              },
              {
                title: 'Number of points',
                val: 3,
              },
              {
                title: 'Abnormality',
                val: 4,
              },
            ],
            selectedParameter: 4,
          },
          configured: true,
        },
        moved: false,
      },
    ],
  },
  mutations: {
    setCustomizeMode: set('customizeMode'),
    toggleCustomizeMode: toggle('customizeMode'),
    setAllWidgets: set('allWidgets'),
    setWidgets: set('widgets'),
  },
});
