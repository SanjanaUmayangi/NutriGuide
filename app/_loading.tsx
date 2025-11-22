import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Loading() {
  // Simple loading indicator
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" />
    </View>
  );
}
