// src/types/vuex-store.d.ts

import { Store } from 'vuex';

interface State {
  message: string;
  count: number;
  dataFromBackground: any; // Замените any на правильный тип данных
}

interface RootState extends State {}

interface Actions {
  fetchMessage: () => Promise<void>;
  incrementCount: () => void;
  fetchDataFromBackground: () => Promise<void>;
}

interface Mutations {
  setMessage: (state: State, message: string) => void;
  increment: (state: State) => void;
  setDataFromBackground: (state: State, data: any) => void; // Замените any на правильный тип данных
}

interface StoreInstance extends Store<RootState> {
  state: State;
  mutations: Mutations;
  actions: Actions;
}

declare module '@vue/runtime-core' {
  // Provide typings for `this.$store` inside Vue components
  interface ComponentCustomProperties {
    $store: StoreInstance;
  }
}
