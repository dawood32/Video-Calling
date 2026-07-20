import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  calls: [], // { id, callerId, receiverId, type: 'audio'|'video', status: 'missed'|'incoming'|'outgoing', timestamp, duration }
};

export const callHistorySlice = createSlice({
  name: 'callHistory',
  initialState,
  reducers: {
    addCallRecord: (state, action) => {
      state.calls.unshift(action.payload); // Add new calls to the top
    },
    clearCallHistory: (state) => {
      state.calls = [];
    },
  },
});

export const { addCallRecord, clearCallHistory } = callHistorySlice.actions;

export default callHistorySlice.reducer;
