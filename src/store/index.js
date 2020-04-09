import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    organizationId: "",
    targetType: "canvass"
  },
  getters: {
    getOrganizationId: state => {
      return state.organizationId;
    },
    getTargetType: state => {
      return state.targetType;
    }
  },
  mutations: {
    setOrganizationId: (state, payload) => {
      state.organizationId = payload;
    },
    setTargetType: (state, payload) => {
      state.targetType = payload;
    }
  },
  actions: {},
  modules: {}
});
