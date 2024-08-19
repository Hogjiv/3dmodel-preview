// store.d.ts

import { Store } from 'vuex';
import { State } from './store';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

// Define the state type
export interface State {
  count: number;
}

// Define the mutation types
export type Mutations = {
  increment(state: State): void;
};

// Define the actions types
export type Actions = {
  incrementCount({ commit }: { commit: (mutation: keyof Mutations, payload?: any) => void }): void;
};
