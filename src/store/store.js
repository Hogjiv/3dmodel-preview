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
    };
  },
  mutations: {
    setScriptRunning(state, isRunning) {
      state.scriptRunning = isRunning;
      console.log(`MUTATION::set status to scriptRunning=${isRunning}`);
  },
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
    modelImage(state, data) {
      state.modelsList = state.modelsList.map((el) => {
        if (el.name !== data.modelName) return el;
        el.title = data.title;
        el.image = data.image;
        return el;
      });
    },
    modelReady(state, modelName) {
      state.modelsList = state.modelsList.map((el) => {
        if (el.name !== modelName) return el;
        el.ready = true;
        return el;
      });
    },
  
    pathSaveModel(state, modelPath) {
      state.pathModel = modelPath;
    },

    pathSaveImage(state, imagePath) {
      state.imagePath = imagePath;
    },
 
  },
  actions: {
    async makePreview({ commit }, data) {
      await window.ipcRenderer.startScript(data);
      console.log("STORE:: makePreview from store/ELECTRON");


      commit("pathSaveModel", data.modelPath);
      console.log("commmit Model store/ELECTRON");

      commit("pathSaveImage", data.imagePath);
      console.log("Save image???");
    },

    electronConnect({ commit }) {
      window.ipcRenderer.onScriptRunning((isRunning) => {
        console.log("STORE::onScriptRunning", isRunning);
        commit("setScriptRunning", isRunning);
      });
 
      window.ipcRenderer.onModelImage((data) => {
        store.commit("modelImage", data);
        console.log(data);
      });

      window.ipcRenderer.onModelSaved((modelName) => {
        store.commit("modelReady", modelName);
      });

      window.ipcRenderer.onModelList((list) => {
        store.commit("setModeslList", list);
        console.log("STORE::setModeslList", list);
      });
    },
  },
});

export default store;
