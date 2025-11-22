import { logout } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfileScreen() {
  const username = useSelector((s: RootState) => s.auth.username);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{username ?? 'Guest'}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Logout" onPress={() => dispatch(logout())} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontWeight: '600', marginRight: 8 },
  value: { color: '#444' },
});
