import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCallHistory } from '../../store/callHistorySlice';

export default function CallHistoryScreen() {
  const calls = useSelector((state) => state.callHistory.calls);
  const dispatch = useDispatch();

  const handleClear = () => {
    dispatch(clearCallHistory());
  };

  const renderCall = ({ item }) => {
    const isMissed = item.status === 'missed';
    return (
      <View style={styles.callCard}>
        <View style={styles.callInfo}>
          <Text style={[styles.callerId, isMissed && styles.missedCallText]}>
            {item.callerId}
          </Text>
          <Text style={styles.callDetails}>
            {item.type} • {item.status} • {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Calls</Text>
        {calls.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {calls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recent calls</Text>
        </View>
      ) : (
        <FlatList
          data={calls}
          keyExtractor={(item) => item.id}
          renderItem={renderCall}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  clearText: { color: '#F44336', fontSize: 16 },
  listContainer: { padding: 15 },
  callCard: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  callInfo: { flex: 1 },
  callerId: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  missedCallText: { color: '#F44336' },
  callDetails: { fontSize: 14, color: '#888' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});
