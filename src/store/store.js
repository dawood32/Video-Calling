import { configureStore } from '@reduxjs/toolkit';
import callHistoryReducer from './callHistorySlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    callHistory: callHistoryReducer,
    chat: chatReducer,
  },
});

export default store;
