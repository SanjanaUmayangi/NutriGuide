import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '../../lib/redux/hooks';
import { login } from '../../lib/redux/slices/authSlice';
import { useRouter } from 'expo-router';

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const schema = yup.object({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().min(6, 'Min 6 chars').required('Required'),
  });

const { control, handleSubmit } = useForm<LoginForm>({
  resolver: yupResolver(schema),
});

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      await dispatch(login(data)).unwrap();
      router.push('/');
    } catch (e: unknown) {
  const err = e as { message?: string };
  Alert.alert('Login failed', err.message ?? 'Unknown error');
}

  };

  return (
    <View style={s.screen}>
      <View style={s.card}>
        <Text style={s.title}>NutriGuide+</Text>
        <Text style={s.subtitle}>Eat Smart. Live Better.</Text>

        {/* Email */}
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              <TextInput
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                style={s.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {fieldState.error && <Text style={s.err}>{fieldState.error.message}</Text>}
            </>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          defaultValue=""
          render={({ field: { onChange, value }, fieldState }) => (
            <>
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                style={s.input}
              />
              {fieldState.error && <Text style={s.err}>{fieldState.error.message}</Text>}
            </>
          )}
        />

        {/* Login button */}
        <TouchableOpacity style={s.button} onPress={handleSubmit(onSubmit)}>
          <Text style={s.btnText}>Login</Text>
        </TouchableOpacity>

        {/* Register link */}
        <TouchableOpacity onPress={() => router.push('/auth/register')} style={{ marginTop: 15 }}>
          <Text style={s.link}>Create an account</Text>
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
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1E1E1E',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 28,
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
  err: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
