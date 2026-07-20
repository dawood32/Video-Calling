import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [], // Array of conversation metadata
  messages: {}, // { [conversationId]: [ { id, text, senderId, timestamp } ] }
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
});

export const { addMessage, setConversations } = chatSlice.actions;

export default chatSlice.reducer;
