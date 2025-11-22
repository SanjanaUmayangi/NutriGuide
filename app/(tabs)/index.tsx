// app/(tabs)/index.tsx for testing purposes
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../lib/redux/slices/authSlice';

export default function Home() {
  const dispatch = useDispatch();
  const username = useSelector((s: any) => s.auth.username);

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Welcome, {username}!
      </Text>
      <Text style={{ marginBottom: 30, textAlign: 'center' }}>
        You have successfully logged in to NutriGuide+
      </Text>
      
      <TouchableOpacity 
        onPress={() => dispatch(logout())}
        style={{ 
          backgroundColor: '#ff4444', 
          padding: 15, 
          borderRadius: 10,
          width: 200,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}