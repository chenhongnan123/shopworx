import IndustryService from '@shopworx/services/api/industry.service';

export default ({
  actions: {
    getMasterElements: async ({ rootState, dispatch }) => {
      try {
        let { me } = rootState.user;
        if (!me) {
          await dispatch('user/getMe', null, { root: true });
          ({ me } = rootState.user);
        }
        const industryId = me.industry.id;
        const { data } = await IndustryService.getMasterByIndustry(industryId);
        if (data && data.results) {
          return data.results.sort((a, b) => a.sequence - b.sequence);
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    getAssets: async ({ rootState, dispatch }) => {
      try {
        let { me } = rootState.user;
        if (!me) {
          await dispatch('user/getMe', null, { root: true });
          ({ me } = rootState.user);
        }
        const industryId = me.industry.id;
        const { data } = await IndustryService.getAssets();
        if (data && data.results) {
          return data.results.filter((asset) => asset.industryId === industryId);
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },
});
