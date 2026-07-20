import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import VideoCallScreen from '../screens/Call/VideoCallScreen';
import AudioCallScreen from '../screens/Call/AudioCallScreen';
import ScreenShareScreen from '../screens/Call/ScreenShareScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import CallHistoryScreen from '../screens/CallHistory/CallHistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AudioCallScreen" component={AudioCallScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ScreenShareScreen" component={ScreenShareScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="CallHistoryScreen" component={CallHistoryScreen} options={{ title: 'Call History' }} />
    </Stack.Navigator>
  );
}
