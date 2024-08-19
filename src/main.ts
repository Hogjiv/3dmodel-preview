import { createApp, nextTick } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store/store'; // Импортируйте уже созданный экземпляр хранилища

import './style.css';
import './demos/ipc';

const app = createApp(App);
app.use(store); // Используйте хранилище как плагин
app.mount('#app');

nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
