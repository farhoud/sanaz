import * as types from './mutation-types';

// initial state
export const state = {
  input: '',
  inputType: 'text',
  commandSuggestions: [],
  inputSuggestions: [],
  history: []
};

// mutations
export const mutations = {
  [types.INPUT_CHANGED](state, value) {
    state.input = value;
  },
  [types.INPUT_TYPE_CHANGED](state, value) {
    state.inputType = value;
  },
  [types.LOUD_COMMAND_SUGGESTION](state, value) {
    state.commandSuggestions = [...value];
  },
  [types.LOUD_INPUT_SUGGESTION](state, value) {
    state.inputSuggestions = [...value];
  },
  [types.ADD_MESSAGE](state, value) {
    state.history = [...state.history, value];
  },
  [types.REMOVE_MESSAGE](state, messageId) {
    state.history = [...state.history.filter((item)=>item.id !== messageId)]
  }
};
