import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType, RtcSurfaceView } from 'react-native-agora';
import { AGORA_APP_ID } from '../../utils/agoraConfig';

export default function ScreenShareScreen({ route, navigation }) {
  const { channelName, token } = route.params || { channelName: 'test_screen_channel', token: '' };
  
  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [agoraEngine, setAgoraEngine] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    setupSDKEngine();
    return () => {
      agoraEngine?.leaveChannel();
      agoraEngine?.release();
    };
  }, []);

  const setupSDKEngine = async () => {
    try {
      const engine = createAgoraRtcEngine();
      engine.initialize({ appId: AGORA_APP_ID });
      
      engine.registerEventHandler({
        onJoinChannelSuccess: () => setJoined(true),
        onUserJoined: (_connection, uid) => setRemoteUid(uid),
        onUserOffline: (_connection, uid) => setRemoteUid(0),
      });

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
      setIsScreenSharing(false);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  const startScreenShare = () => {
    agoraEngine?.startScreenCapture({
      isCaptureWindow: false,
      isCaptureDisplay: true,
      screenCaptureParameters: {
        bitrate: 0,
        frameRate: 15,
        width: 1280,
        height: 720,
        contentHint: 1,
      },
    });
    setIsScreenSharing(true);
  };

  const stopScreenShare = () => {
    agoraEngine?.stopScreenCapture();
    setIsScreenSharing(false);
  };

  return (
    <View style={styles.container}>
      {joined ? (
        <View style={styles.videoContainer}>
          {remoteUid !== 0 ? (
            <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.remoteVideo} />
          ) : (
            <Text style={styles.waitingText}>Waiting for others to view...</Text>
          )}
          {isScreenSharing && (
            <Text style={styles.sharingBanner}>You are sharing your screen</Text>
          )}
        </View>
      ) : (
        <View style={styles.joinContainer}>
          <Text style={styles.title}>Screen Share</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!joined ? (
          <TouchableOpacity style={styles.joinButton} onPress={join}>
            <Text style={styles.buttonText}>Join Session</Text>
          </TouchableOpacity>
        ) : (
          <>
            {!isScreenSharing ? (
              <TouchableOpacity style={styles.controlButton} onPress={startScreenShare}>
                <Text style={styles.buttonText}>Start Share</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.stopButton} onPress={stopScreenShare}>
                <Text style={styles.buttonText}>Stop Share</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.leaveButton} onPress={leave}>
              <Text style={styles.buttonText}>End</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#202020' },
  videoContainer: { flex: 1, justifyContent: 'center' },
  remoteVideo: { flex: 1 },
  waitingText: { color: '#ccc', textAlign: 'center', fontSize: 18 },
  sharingBanner: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: 'rgba(76,175,80,0.8)', padding: 10, textAlign: 'center', color: 'white', fontWeight: 'bold' },
  joinContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: 'white', fontSize: 24, marginBottom: 20 },
  buttonContainer: { position: 'absolute', bottom: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  joinButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 30, width: 200, alignItems: 'center' },
  controlButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 30, width: 140, alignItems: 'center' },
  stopButton: { backgroundColor: '#FF9800', padding: 15, borderRadius: 30, width: 140, alignItems: 'center' },
  leaveButton: { backgroundColor: '#F44336', padding: 15, borderRadius: 30, width: 100, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
