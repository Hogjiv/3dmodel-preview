// ./store/store.ts
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      modelPath: "",
      imagePath: "",
      modelsList: [],
      scriptRunning: false,
      title: "",  
      count: 0,
      dataFromBackground: null,
      number: 0,
    };
  },
  mutations: {
    setModeslList(state, data) {
      state.modelsList = data.map((el) => {
        if (typeof el === "object") return el;
        return {
          name: el,
          ready: false,
          title: "",
          image: null,
        };
      });
    },

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
 

      commit("pathSaveImage", data.imagePath);
      console.log("Save image???");
    },
  
    electronConnect({ commit }) {
      window.ipcRenderer.onScriptRunning((isRunning) => {
        console.log("STORE::onScriptRunning", isRunning);
        commit("setScriptRunning", isRunning);
      });

      window.ipcRenderer.onModelList((list) => {
        store.commit("setModeslList", list);
        console.log("STORE::setModeslList", isRunning);
      });



    },
  
    
  },
});

export default store;
