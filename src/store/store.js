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
      notifications: [],
    };
  },
  mutations: {
    addNotification(state, notification) {
      state.notifications.push(notification);
    },
    removeNotification(state, notificationId) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== notificationId
      );
    },
    setScriptRunning(state, isRunning) {
      state.scriptRunning = isRunning;
      console.log(`MUTATION::set status to !! scriptRunning=${isRunning}`);
    },
    setModeslList(state, data) {
      state.modelsList = data.map((el) => {
        console.log("  MUTATION:: setModeslList,  ", data);
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
      console.log("  MUTATION:: modelImage ", data);
      state.modelsList = state.modelsList.map((el) => {
          if (el.name !== data.modelName) return el;
          el.title = data.title || "NO TITLE"; 
          // the stroke below for all images
          el.image = data.image 
         // el.image = data.image || "./noImageFound.jpg";  
          console.log("DATA DATA)))))))))))))", data);
          return el;
      });
  },
  
    modelReady(state, modelName) {
      console.log("  MUTATION:: modelReady ", modelName);
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
    notificationVisible({ commit }, payload) {
      const id = Date.now();
      const notification = {
        id,
        message: payload.message,
        isVisible: true,
      };

      commit("addNotification", notification);
      console.log("vuex store notificationVisible", id, payload.message);

      setTimeout(() => {
        commit("removeNotification", id);
        console.log("remove notification", id);
      }, 2000);
    },
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
      
        commit("setScriptRunning", isRunning);
        console.log("STORE::onScriptRunning", isRunning);
      });

      window.ipcRenderer.onModelImage((data) => {
        store.commit("modelImage", data);
        console.log(data);
      });

      window.ipcRenderer.onModelSaved((modelName) => {
        store.commit("modelReady", modelName);
        console.log("STORE::setModeslList");
      });

      window.ipcRenderer.onModelList((list) => {
        store.commit("setModeslList", list);
        console.log("STORE::setModeslList", list);
      });
    },
  },
});

export default store;
