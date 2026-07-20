import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';
import { AGORA_APP_ID } from '../../utils/agoraConfig';

export default function AudioCallScreen({ route, navigation }) {
  const { channelName, token } = route.params || { channelName: 'test_audio_channel', token: '' };
  
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [agoraEngine, setAgoraEngine] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setupAudioSDKEngine();
    return () => {
      agoraEngine?.leaveChannel();
      agoraEngine?.release();
    };
  }, []);

  const setupAudioSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      }
      
      const engine = createAgoraRtcEngine();
      engine.initialize({ appId: AGORA_APP_ID });
      
      engine.registerEventHandler({
        onJoinChannelSuccess: () => setJoined(true),
        onUserJoined: (_connection, uid) => setRemoteUid(uid),
        onUserOffline: (_connection, uid) => setRemoteUid(0),
      });

      engine.enableAudio();
      engine.disableVideo(); // Ensure video is disabled for audio call
      setAgoraEngine(engine);
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (joined) return;
    try {
      agoraEngine?.joinChannel(token, channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    try {
      agoraEngine?.leaveChannel();
      setJoined(false);
      setRemoteUid(0);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    agoraEngine?.muteLocalAudioStream(nextMuted);
    setIsMuted(nextMuted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Audio Call</Text>
        {joined ? (
          <Text style={styles.statusText}>
            {remoteUid !== 0 ? `Connected with User ${remoteUid}` : 'Waiting for others...'}
          </Text>
        ) : (
          <Text style={styles.statusText}>Ready to join {channelName}</Text>
        )}
      </View>

      <View style={styles.controlsContainer}>
        {!joined ? (
          <TouchableOpacity style={styles.joinButton} onPress={join}>
            <Text style={styles.buttonText}>Join Call</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={[styles.controlButton, isMuted && styles.mutedButton]} onPress={toggleMute}>
              <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.leaveButton} onPress={leave}>
              <Text style={styles.buttonText}>End Call</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  infoContainer: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  statusText: { fontSize: 18, color: '#666', marginTop: 10 },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' },
  joinButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 30, width: 150, alignItems: 'center' },
  leaveButton: { backgroundColor: '#F44336', padding: 15, borderRadius: 30, width: 120, alignItems: 'center' },
  controlButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 30, width: 120, alignItems: 'center' },
  mutedButton: { backgroundColor: '#9E9E9E' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
