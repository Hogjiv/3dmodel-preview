// ./store/store.ts
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      modelPath: "",
      imagePath: "",
      count: 0,
      dataFromBackground: null, 
      number: 0
    };
  },
  mutations: {
    pathSaveModel(state, modelPath) {
      state.pathModel = modelPath;
  },
  pathSaveImage(state, imagePath) {
    state.imagePath = imagePath;
},
    increment(state) {
      state.count += 1;
    },
    setDataFromBackground(state, data) { // Новая мутация
      state.dataFromBackground = data;
    },
    updateNumber(state, number) {
      console.log('STORE::updateNumber');
      state.number = number;
    }
  },
  actions: {
  //   async makePreview({commit}, data) {
  //     window.API.startScript(data)
  //     console.log('makePreview from store/ELECTRON')
  //     commit("pathSaveModel", data.modelPath);
  //     console.log('commmit Model store/ELECTRON')

  //     commit("pathSaveImage", data.imagePath);
  //     console.log('Save image???')
  // },
  async makePreview({commit}, data) {
    await window.ipcRenderer.startScript(data);
    console.log('makePreview from store/ELECTRON');
    commit("pathSaveModel", data.modelPath);
    console.log('commmit Model store/ELECTRON');

    commit("pathSaveImage", data.imagePath);
    console.log('Save image???');
  },

    incrementCount({ commit }) {
      commit('increment');
    },
    async fetchDataFromBackground({ commit }) { // Новое действие
      const data = await window.ipcRenderer.invoke('fetchBackgroundData');
      commit('setDataFromBackground', data);
    }
  },
});

export default store;
