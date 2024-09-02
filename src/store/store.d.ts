// ./store/store.ts
import { createStore, Store } from 'vuex';
import { App } from 'vue';

// Определяем интерфейс состояния
interface State {
  modelPath: string;
  imagePath: string;
  modelsList: Array<{
    name: string;
    ready: boolean;
    title: string;
    image: string | null;
  }>;
  scriptRunning: boolean;
  title: string;
}

// Создаем хранилище
const store: Store<State> = createStore<State>({
  state: {
    modelPath: '',
    imagePath: '',
    modelsList: [],
    scriptRunning: false,
    title: '',
  },
  mutations: {
    setScriptRunning(state, isRunning: boolean) {
      state.scriptRunning = isRunning;
      console.log(`MUTATION::set status to scriptRunning=${isRunning}`);
    },
    setModeslList(state, data: Array<string | object>) {
      state.modelsList = data.map((el) => {
        if (typeof el === 'object') return el as { name: string; ready: boolean; title: string; image: string | null; };
        return {
          name: el as string,
          ready: false,
          title: '',
          image: null,
        };
      });
    },
    modelImage(state, data: { modelName: string; title: string; image: string }) {
      state.modelsList = state.modelsList.map((el) => {
        if (el.name !== data.modelName) return el;
        el.title = data.title;
        el.image = data.image;
        return el;
      });
    },
    modelReady(state, modelName: string) {
      state.modelsList = state.modelsList.map((el) => {
        if (el.name !== modelName) return el;
        el.ready = true;
        return el;
      });
    },
    pathSaveModel(state, modelPath: string) {
      state.modelPath = modelPath;
    },
    pathSaveImage(state, imagePath: string) {
      state.imagePath = imagePath;
    },
  },
  actions: {
    async makePreview({ commit }, data: { modelPath: string; imagePath: string }) {
      await window.ipcRenderer.startScript(data);
      console.log('STORE:: makePreview from store/ELECTRON');

      commit('pathSaveModel', data.modelPath);
      console.log('commmit Model store/ELECTRON');

      commit('pathSaveImage', data.imagePath);
      console.log('Save image???');
    },

    electronConnect({ commit }) {
      window.ipcRenderer.onScriptRunning((isRunning) => {
        console.log('STORE::onScriptRunning', isRunning);
        commit('setScriptRunning', isRunning);
      });

      window.ipcRenderer.onModelImage((data) => {
        store.commit('modelImage', data);
        console.log(data);
      });

      window.ipcRenderer.onModelSaved((modelName) => {
        store.commit('modelReady', modelName);
      });

      window.ipcRenderer.onModelList((list) => {
        store.commit('setModeslList', list);
        console.log('STORE::setModeslList', list);
      });
    },
  },
});

// Метод для корректной установки плагина
store.install = (app: App) => {
  app.provide('store', store);
  app.config.globalProperties.$store = store;
  app.use(store);
};

export default store;
