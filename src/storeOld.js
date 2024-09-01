import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      modelPath: "",
      imagePath: "",
      modelsList: [],
      title: "",  
      scriptRunning: false,
    };
  },
  mutations: {
    pathSaveModel(state, modelPath) {
      state.pathModel = modelPath;
    },

    pathSaveImage(state, imagePath) {
      state.imagePath = imagePath;
    },
    setSocket(state, next) {
      state.socket = next;
    },
    setScriptRunning(state, next) {
      state.scriptRunning = next;
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
  },
  actions: {
    async makePreview({ commit }, data) {
      //state.socket.emit("startScript", data);
      window.API.startScript(data);
      console.log("makePreview from store/ELECTRON");

      //commit("pathSaveModel", data.modelPath);
      commit("pathSaveModel", data.modelPath);
      console.log("commmit Model store/ELECTRON");

      commit("pathSaveImage", data.imagePath);
      console.log("Save image???");
    },

    electronConnect() {
      window.API.onScriptRunning((isRunning) => {
        console.log("onScriptRunning STORE", isRunning);
        store.commit("setScriptRunning", isRunning);
      });
      window.API.onModelList((list) => {
        store.commit("setModeslList", list);
      });
      window.API.onModelImage((data) => {
        console.log(data);
        store.commit("modelImage", data);
      });
      window.API.onModelSaved((modelName) => {
        store.commit("modelReady", modelName);
      });
    },
    async previewStatus() {},
  },
});

export default store;
