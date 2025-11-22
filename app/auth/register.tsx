import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  const onRegister = () => {
    Alert.alert('Registered (mock)', 'Please login');
    router.replace('/auth/login');
  };

  return (
    <View style={s.screen}>
      <View style={s.card}>
        <Text style={s.title}>Create Account</Text>
        <Text style={s.subtitle}>Join NutriGuide+ today</Text>

        <TextInput placeholder="Email" style={s.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Password" secureTextEntry style={s.input} />

        <TouchableOpacity style={s.button} onPress={onRegister}>
          <Text style={s.btnText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/login')} style={{ marginTop: 15 }}>
          <Text style={s.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    backgroundColor: '#F8F9FA',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1E1E1E',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6B6B6B',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F2F3F4',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
});
