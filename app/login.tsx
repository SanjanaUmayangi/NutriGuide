import { loginDummy } from '@/api/dummyApi';
import { loginSuccess } from '@/redux/slices/authSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';

export default function LoginScreen() {
  const [username, setUsername] = useState('kminchelle');
  const [password, setPassword] = useState('0lelplR');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  async function handleLogin() {
    try {
      setLoading(true);
      const res = await loginDummy(username, password);
      // dummyjson returns { token, ... }
      dispatch(loginSuccess({ username: username, token: res.token }));
      router.push('/');
    } catch (e: any) {
      Alert.alert('Login failed', e?.response?.data?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 8, marginBottom: 12 },
});
