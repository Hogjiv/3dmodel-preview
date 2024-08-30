// ./store/store.ts
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      modelPath: "",
      imagePath: "",
      count: 0,
      dataFromBackground: null,
      number: 0,
      scriptRunning: false,
    };
  },
  mutations: {
    setScriptRunning(state, next) {
      state.scriptRunning = next;
      console.log("MUTATION::setScriptRunning");
    },
    pathSaveModel(state, modelPath) {
      state.pathModel = modelPath;
    },

    pathSaveImage(state, imagePath) {
      state.imagePath = imagePath;
    },
    increment(state) {
      state.count += 1;
    },
    setDataFromBackground(state, data) {
      state.dataFromBackground = data;
    },
    updateNumber(state, number) {
      console.log("STORE::updateNumber");
      state.number = number;
    },
  },
  actions: {
    async makePreview({ commit }, data) {
      await window.ipcRenderer.startScript(data);
      console.log("STORE:: makePreview from store/ELECTRON");
      commit("pathSaveModel", data.modelPath);
    },

    // window.API.onScriptRunning(isRunning => {
    //   console.log('onScriptRunning STORE', isRunning)
    //   store.commit("setScriptRunning", isRunning)
    // }),

    // onScriptRunning({commit}, data) {
    //   console.log('STORE::onScriptRunning ', data)
    //   store.commit("setScriptRunning", isRunning)
    // },

    // electronConnect() {}
    electronConnect({ commit }) {
      window.ipcRenderer.onScriptRunning((isRunning) => {
        console.log("STORE::onScriptRunning", isRunning);
        commit("setScriptRunning", isRunning);
      });
    },
  
   
    incrementCount({ commit }) {
      commit("increment");
    },
    async fetchDataFromBackground({ commit }) {
      // Новое действие
      const data = await window.ipcRenderer.invoke("fetchBackgroundData");
      commit("setDataFromBackground", data);
    },
  },
});

export default store;
