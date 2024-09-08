import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

export interface State {
  modelPath: string;
  imagePath: string;
  modelsList: Model[];
  scriptRunning: boolean;
  title: string;
  notifications: Notification[];
}

export interface Model {
  name: string;
  ready: boolean;
  title: string;
  image: string | null;
}

export interface Notification {
  id: number;
  message: string;
  isVisible: boolean;
}

export interface Mutations {
  addNotification(state: State, notification: Notification): void;
  removeNotification(state: State, notificationId: number): void;
  setScriptRunning(state: State, isRunning: boolean): void;
  setModeslList(state: State, data: (string | Model)[]): void;
  modelImage(state: State, data: { modelName: string; title: string; image: string }): void;
  modelReady(state: State, modelName: string): void;
  pathSaveModel(state: State, modelPath: string): void;
  pathSaveImage(state: State, imagePath: string): void;
}

export interface Actions {
  notificationVisible(context: ActionContext, payload: { message: string }): void;
  makePreview(context: ActionContext, data: { modelPath: string; imagePath: string }): Promise<void>;
  electronConnect(context: ActionContext): void;
}

interface ActionContext {
  commit: (type: string, payload?: any) => void;
}

declare const store: Store<State>;
export default store;

// // ./store/store.ts
// import { createStore, Store } from 'vuex';
// import { App } from 'vue';

// // Определяем интерфейс состояния
// interface State {
//   modelPath: string;
//   imagePath: string;
//   modelsList: Array<{
//     name: string;
//     ready: boolean;
//     title: string;
//     image: string | null;
//   }>;
//   scriptRunning: boolean;
//   title: string;
//   notifications: Array<{
//     id: number;
//     message: string;
//     isVisible: boolean;
//   }>;
// }

// // Создаем хранилище
// const store: Store<State> = createStore<State>({
//   state() {
//     return {
//       modelPath: '',
//       imagePath: '',
//       modelsList: [],
//       scriptRunning: false,
//       title: '',
//       notifications: [],
//     };
//   },
//   mutations: {
//     addNotification(state, notification: { id: number; message: string; isVisible: boolean }) {
//       state.notifications.push(notification);
//     },
//     removeNotification(state, notificationId: number) {
//       state.notifications = state.notifications.filter(
//         (notification) => notification.id !== notificationId
//       );
//     },
//     setScriptRunning(state, isRunning: boolean) {
//       state.scriptRunning = isRunning;
//       console.log(`MUTATION::set status to scriptRunning=${isRunning}`);
//     },
//     setModeslList(state, data: Array<string | { name: string; ready: boolean; title: string; image: string | null }>) {
//       state.modelsList = data.map((el) => {
//         if (typeof el === 'object') return el;
//         return {
//           name: el,
//           ready: false,
//           title: '',
//           image: null,
//         };
//       });
//     },
//     modelImage(state, data: { modelName: string; title: string; image: string }) {
//       state.modelsList = state.modelsList.map((el) => {
//         if (el.name !== data.modelName) return el;
//         el.title = data.title;
//         el.image = data.image;
//         return el;
//       });
//     },
//     modelReady(state, modelName: string) {
//       state.modelsList = state.modelsList.map((el) => {
//         if (el.name !== modelName) return el;
//         el.ready = true;
//         return el;
//       });
//     },
//     pathSaveModel(state, modelPath: string) {
//       state.modelPath = modelPath;
//     },
//     pathSaveImage(state, imagePath: string) {
//       state.imagePath = imagePath;
//     },
//   },
//   actions: {
//     notificationVisible({ commit }, payload: { message: string }) {
//       const id = Date.now();
//       const notification = {
//         id,
//         message: payload.message,
//         isVisible: true,
//       };

//       commit('addNotification', notification);
//       console.log('vuex store notificationVisible', id, payload.message);

//       setTimeout(() => {
//         commit('removeNotification', id);
//         console.log('remove notification', id);
//       }, 1000);
//     },
//     async makePreview({ commit }, data: { modelPath: string; imagePath: string }) {
//       await window.ipcRenderer.startScript(data);
//       console.log('STORE:: makePreview from store/ELECTRON');

//       commit('pathSaveModel', data.modelPath);
//       console.log('commmit Model store/ELECTRON');

//       commit('pathSaveImage', data.imagePath);
//       console.log('Save image???');
//     },
//     electronConnect({ commit }) {
//       window.ipcRenderer.onScriptRunning((isRunning) => {
//         console.log('STORE::onScriptRunning', isRunning);
//         commit('setScriptRunning', isRunning);
//       });

//       window.ipcRenderer.onModelImage((data) => {
//         store.commit('modelImage', data);
//         console.log(data);
//       });

//       window.ipcRenderer.onModelSaved((modelName) => {
//         store.commit('modelReady', modelName);
//       });

//       window.ipcRenderer.onModelList((list) => {
//         store.commit('setModeslList', list);
//         console.log('STORE::setModeslList', list);
//       });
//     },
//   },
// });

// // Метод для корректной установки плагина
// store.install = (app: App) => {
//   app.provide('store', store);
//   app.config.globalProperties.$store = store;
//   app.use(store);
// };

// export default store;
