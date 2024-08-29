// ./store/store.ts
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      count: 0,
      dataFromBackground: null, 
      number: 0
    };
  },
  mutations: {
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
