import { createApp, nextTick } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store/store';  

import './style.css';
import './demos/ipc';

const app = createApp(App);
 
app.use(store); 

app.mount('#app');

nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
}); 




//THIS CODE FOR 2 stores

// import { createApp, nextTick } from 'vue';
// import App from './App.vue';
// import 'bootstrap/dist/css/bootstrap.min.css'; 
// import notifications from './store/notifications'; 
// import { createStore } from 'vuex';

// import './style.css';
// import './demos/ipc';


// const app = createApp(App);
 
// const store = createStore({
//   modules: {
//     notifications,
//   },
// });  
// store.install(app); 


// app.mount('#app');


// nextTick(() => {
//   postMessage({ payload: 'removeLoading' }, '*');
// });


// main.ts
// import { createApp, nextTick } from 'vue';
// import App from './App.vue';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import store from './store/store'; 

// import './style.css';
// import './demos/ipc';

// const app = createApp(App);

// // Используйте хранилище как плагин
// store.install(app); 

// app.mount('#app');

// nextTick(() => {
//   postMessage({ payload: 'removeLoading' }, '*');
// });

// store.js
// import Vue from 'vue';
// import Vuex from 'vuex';
// import notifications from './notifications';

// Vue.use(Vuex);

// export default new Vuex.Store({
//   modules: {
//     notifications,
//   },
// }); 



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