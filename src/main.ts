// import { createApp, nextTick } from 'vue';
// import App from './App.vue';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import store from './store/store';  

// import './style.css';
// import './demos/ipc';

// const app = createApp(App);

// // Используйте хранилище как плагин
// app.use(store); 

// app.mount('#app');

// nextTick(() => {
//   postMessage({ payload: 'removeLoading' }, '*');
// });
//src/main.ts

// main.ts
import { createApp, nextTick } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store/store'; // Убедитесь, что путь правильный

import './style.css';
import './demos/ipc';

const app = createApp(App);

// Используйте хранилище как плагин
store.install(app); 

app.mount('#app');

nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});

 
// import { createStore } from 'vuex';
// import { createApp } from 'vue';
// import 'bootstrap/dist/css/css/bootstrap.min.css';
// import App from './App.vue';
// import './style.css';
// import './demos/ipc';

// const store = createStore({
//   // your store options
// });

// const app = createApp(App);
// app.mount('#app');

// store.install = (app: any) => {
//   app.use(store);
// };

// export default store;