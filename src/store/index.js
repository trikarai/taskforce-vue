import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    organizationId: "",
    fieldWorkerId: "",
    targetType: "canvass"
  },
  getters: {
    getOrganizationId: state => {
      return state.organizationId;
    },
    getFieldWorkerId: state => {
      return state.fieldWorkerId;
    },
    getTargetType: state => {
      return state.targetType;
    }
  },
  mutations: {
    setOrganizationId: (state, payload) => {
      state.organizationId = payload;
    },
    setFieldWorkerId: (state, payload) => {
      state.fieldWorkerId = payload;
    },
    setTargetType: (state, payload) => {
      state.targetType = payload;
    }
  },
  actions: {},
  modules: {}
});
