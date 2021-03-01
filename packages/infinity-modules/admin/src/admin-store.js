import { set } from '@shopworx/services/util/store.helper';
import UserService from '@shopworx/services/api/user.service';
import SiteService from '@shopworx/services/api/site.service';
import ReportService from '@shopworx/services/api/report.service';

export default ({
  namespaced: true,
  state: {
    users: [],
    masterSolutions: [],
  },
  mutations: {
    setUsers: set('users'),
    setMasterSolutions: set('masterSolutions'),
  },
  actions: {
    getAllUsers: async ({ commit }) => {
      try {
        const { data } = await UserService.getUsers();
        if (data && data.results) {
          const users = data.results;
          commit('setUsers', users);
        } else {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    getMasterSolutions: async ({ commit }) => {
      try {
        const { data } = await SiteService.getMasterSolutions();
        if (data && data.results) {
          const solutions = data.results;
          commit('setMasterSolutions', solutions);
        } else {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    resendInvitation: async (_, payload) => {
      try {
        const { data } = await UserService.resendInvitation(payload);
        return data;
      } catch (e) {
        return false;
      }
    },

    createNewRole: async (_, payload) => {
      try {
        const { data } = await UserService.createRole(payload);
        if (data && data.created) {
          return data.roleId;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    updateUser: async ({ dispatch, commit }, payload) => {
      try {
        const { data } = await UserService.updateUser(payload);
        if (data && data.results) {
          commit('helper/setAlert', {
            show: true,
            type: 'success',
            message: 'USER_DELETED',
          }, {
            root: true,
          });
          await dispatch('getAllUsers');
        } else {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    updateUserRole: async ({ commit }, { userId, roleId }) => {
      try {
        const { data } = await UserService.updateUserRole(userId, roleId);
        if (data && data.updated) {
          commit('helper/setAlert', {
            show: true,
            type: 'success',
            message: 'ROLE_UPDATED',
          }, {
            root: true,
          });
        } else {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    updateRole: async ({ commit }, payload) => {
      try {
        const { data } = await UserService.updateRole(payload);
        if (data && data.results) {
          commit('helper/setAlert', {
            show: true,
            type: 'success',
            message: 'ROLE_UPDATED',
          }, {
            root: true,
          });
        } else {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    deleteModuleAccess: async (_, roleId) => {
      try {
        const { data } = await UserService.deleteModuleAccess(roleId);
        if (data && data.deleted) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    deleteWebAppAccess: async (_, roleId) => {
      try {
        const { data } = await UserService.deleteWebAppAccess(roleId);
        if (data && data.deleted) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    deleteReportsCategoryAccess: async (_, roleId) => {
      try {
        const { data } = await UserService.deleteReportsCategoryAccess(roleId);
        if (data && data.deleted) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    deleteReportAccess: async (_, roleId) => {
      try {
        const { data } = await UserService.deleteReportAccess(roleId);
        if (data && data.deleted) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    deleteReportViewAccess: async (_, roleId) => {
      try {
        const { data } = await UserService.deleteReportViewAccess(roleId);
        if (data && data.deleted) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    createSolutionAccess: async ({ state }, roleId) => {
      try {
        const { masterSolutions } = state;
        const createAccess = masterSolutions.map(async (s) => {
          const { data } = await UserService.createSolutionAccess({
            solutionId: s.id,
            roleId,
          });
          if (data && data.created) {
            return true;
          }
          return false;
        });
        const results = await Promise.all(createAccess);
        return results.every((res) => res === true);
      } catch (e) {
        return false;
      }
    },

    createElementAccess: async ({ rootState, dispatch }, roleId) => {
      try {
        const { activeSite } = rootState.user;
        const result = await dispatch(
          'element/getElementsBySite',
          activeSite,
          { root: true },
        );
        if (result && result.length) {
          const elements = result.map((r) => r.element);
          const elementIds = elements.map((e) => e.id);
          const { data } = await UserService.createElementAccess({
            elementIds,
            roleId,
            accessType: 'READ_WRITE_DELETE',
          });
          return data && data.created;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    createModuleAccess: async (_, payload) => {
      try {
        const { data } = await UserService.createModuleAccess(payload);
        if (data && data.created) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    createReportAccess: async (_, roleId) => {
      try {
        const { data } = await SiteService.getReports();
        if (data && data.results) {
          const reports = data.results.map((r) => r.report);
          const reportIds = reports.map((r) => r.id);
          const results = await Promise.all(reportIds.map(async (id) => {
            const { data: result } = await UserService.createReportAccess({
              reportId: id,
              roleId,
              accessType: 'READ_WRITE_DELETE',
            });
            if (result && result.created) {
              return true;
            }
            return false;
          }));
          return results.every((res) => res === true);
        }
      } catch (e) {
        return false;
      }
      return true;
    },

    createReportViewAccess: async (_, { reportCategoryIds, roleId }) => {
      try {
        if (reportCategoryIds && reportCategoryIds.length) {
          const created = await Promise.all(reportCategoryIds.map(async (reportCategoryId) => {
            const { data } = await ReportService.getReportViews(reportCategoryId);
            if (data && data.results) {
              const reportViewIds = data.results.map((r) => r.id);
              const res = await Promise.all(reportViewIds.map(async (id) => {
                const { data: result } = await UserService.createReportViewAccess({
                  reportViewId: id,
                  roleId,
                  accessType: 'READ_WRITE_DELETE',
                });
                if (result && result.created) {
                  return true;
                }
                return false;
              }));
              return res.every((r) => r === true);
            }
            return false;
          }));
          return created.every((r) => r === true);
        }
      } catch (e) {
        return false;
      }
      return true;
    },
  },
});
