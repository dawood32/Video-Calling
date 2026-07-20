import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../store/chatSlice';
// import { ChatClient, ChatMessage, ChatOptions } from 'react-native-agora-chat';
// Note: Initializing Agora Chat Client should ideally be done in an App wrapper or App.js
// using ChatClient.getInstance().init(new ChatOptions({ appKey: 'YOUR_APP_KEY' }));

export default function ChatScreen({ route, navigation }) {
  const { conversationId } = route.params || { conversationId: 'global' };
  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();
  
  // Using Redux state to display messages locally
  const messages = useSelector((state) => state.chat.messages[conversationId] || []);
  const currentUser = 'Me'; // Placeholder for current user ID

  useEffect(() => {
    // Add event listeners for Agora Chat SDK here if integrated
    // e.g., ChatClient.getInstance().chatManager.addMessageListener(...)
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      senderId: currentUser,
      timestamp: new Date().toISOString(),
    };

    // Dispatch locally
    dispatch(addMessage({ conversationId, message: newMessage }));
    
    // Agora SDK implementation would go here:
    // const msg = ChatMessage.createTextMessage(conversationId, inputText);
    // ChatClient.getInstance().chatManager.sendMessage(msg);

    setInputText('');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === currentUser;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContainer}
        inverted={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  listContainer: { padding: 15, paddingBottom: 20 },
  messageBubble: { padding: 12, borderRadius: 20, marginBottom: 10, maxWidth: '80%' },
  myMessage: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirMessage: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { color: 'white', fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, marginRight: 10, color: '#333' },
  sendButton: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  sendButtonText: { color: 'white', fontWeight: 'bold' },
});
