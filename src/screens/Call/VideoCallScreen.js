import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType, RtcSurfaceView } from 'react-native-agora';
import { AGORA_APP_ID } from '../../utils/agoraConfig';

export default function VideoCallScreen({ route, navigation }) {
  const { channelName, token } = route.params || { channelName: 'test_channel', token: '' };
  
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [agoraEngine, setAgoraEngine] = useState(null);

  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      agoraEngine?.leaveChannel();
      agoraEngine?.release();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }
      
      const engine = createAgoraRtcEngine();
      engine.initialize({ appId: AGORA_APP_ID });
      
      engine.registerEventHandler({
        onJoinChannelSuccess: () => setJoined(true),
        onUserJoined: (_connection, uid) => setRemoteUid(uid),
        onUserOffline: (_connection, uid) => setRemoteUid(0),
      });

      engine.enableVideo();
      setAgoraEngine(engine);
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (joined) return;
    try {
      agoraEngine?.startPreview();
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

  return (
    <View style={styles.container}>
      {joined ? (
        <View style={styles.videoContainer}>
          {remoteUid !== 0 ? (
            <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.remoteVideo} />
          ) : (
            <Text style={styles.waitingText}>Waiting for others to join...</Text>
          )}
          <RtcSurfaceView canvas={{ uid: 0 }} style={styles.localVideo} />
        </View>
      ) : (
        <View style={styles.joinContainer}>
          <Text style={styles.title}>Ready to join?</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!joined ? (
          <TouchableOpacity style={styles.joinButton} onPress={join}>
            <Text style={styles.buttonText}>Join Call</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.leaveButton} onPress={leave}>
            <Text style={styles.buttonText}>End Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  videoContainer: { flex: 1 },
  remoteVideo: { flex: 1 },
  localVideo: { position: 'absolute', width: 120, height: 160, right: 20, top: 20, zIndex: 10 },
  waitingText: { color: 'white', textAlign: 'center', marginTop: 100, fontSize: 18 },
  joinContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: 'white', fontSize: 24 },
  buttonContainer: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' },
  joinButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 30, width: 200, alignItems: 'center' },
  leaveButton: { backgroundColor: '#F44336', padding: 15, borderRadius: 30, width: 200, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
