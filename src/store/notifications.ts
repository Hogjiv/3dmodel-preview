import { ActionContext } from 'vuex';

// Определяем интерфейс для состояния модуля
interface Notification {
  id: number;
  message: string;
  isVisible: boolean;
}

interface UiState {
  notifications: Notification[];
}

// Определяем начальное состояние
const state: UiState = {
  notifications: [],
};

// Определяем типы для мутаций
const mutations = {
  addNotification(state: UiState, notification: Notification) {
    state.notifications.push(notification);
  },
  removeNotification(state: UiState, notificationId: number) {
    state.notifications = state.notifications.filter(
      (notification) => notification.id !== notificationId
    );
  },
};

// Определяем типы для контекста действий
type UiActionContext = ActionContext<UiState, any>;

// Определяем действия с использованием типизированного контекста
const actions = {
  notificationVisible({ commit }: UiActionContext, payload: { message: string }) {
    const id = Date.now();
    const notification: Notification = {
      id,
      message: payload.message,
      isVisible: true,
    };

    commit('addNotification', notification);
    console.log('vuex store notificationVisible', id, payload.message);

    setTimeout(() => {
      commit('removeNotification', id);
      console.log('remove notification', id);
    }, 1000);
  },
};

// Экспортируем модуль Vuex
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
