// app/index.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  const token = useSelector((s: any) => s.auth.token);

  useEffect(() => {
    // If logged in go to tabs, else go to auth login
    if (token) router.replace('/(tabs)');
    else router.replace('/auth/login');
  }, [token]);

  return null;
}
