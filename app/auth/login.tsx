// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { useForm, Controller } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useAppDispatch } from '../../lib/redux/hooks';
// import { login } from '../../lib/redux/slices/authSlice';
// import { useRouter } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import useAuth from '../../hooks/useAuth';
// import useTheme from '../../hooks/useTheme';

// type LoginForm = {
//   email: string;
//   password: string;
// };

// export default function Login() {
//   const schema = yup.object({
//     email: yup.string().email('Invalid email').required('Required'),
//     password: yup.string().min(6, 'Min 6 chars').required('Required'),
//   });

// const { control, handleSubmit } = useForm<LoginForm>({
//   resolver: yupResolver(schema),
// });

//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const onSubmit = async (data: LoginForm) => {
//     try {
//       await dispatch(login(data)).unwrap();
//       router.push('/');
//     } catch (e: unknown) {
//   const err = e as { message?: string };
//   Alert.alert('Login failed', err.message ?? 'Unknown error');
// }

//   };

//   return (
//     <View style={s.screen}>
//       <View style={s.card}>
//         <Text style={s.title}>NutriGuide+</Text>
//         <Text style={s.subtitle}>Eat Smart. Live Better.</Text>

//         {/* Email */}
//         <Controller
//           control={control}
//           name="email"
//           defaultValue=""
//           render={({ field: { onChange, value }, fieldState }) => (
//             <>
//               <TextInput
//                 placeholder="Email"
//                 value={value}
//                 onChangeText={onChange}
//                 style={s.input}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//               />
//               {fieldState.error && <Text style={s.err}>{fieldState.error.message}</Text>}
//             </>
//           )}
//         />

//         {/* Password */}
//         <Controller
//           control={control}
//           name="password"
//           defaultValue=""
//           render={({ field: { onChange, value }, fieldState }) => (
//             <>
//               <TextInput
//                 placeholder="Password"
//                 secureTextEntry
//                 value={value}
//                 onChangeText={onChange}
//                 style={s.input}
//               />
//               {fieldState.error && <Text style={s.err}>{fieldState.error.message}</Text>}
//             </>
//           )}
//         />

//         {/* Login button */}
//         <TouchableOpacity style={s.button} onPress={handleSubmit(onSubmit)}>
//           <Text style={s.btnText}>Login</Text>
//         </TouchableOpacity>

//         {/* Register link */}
//         <TouchableOpacity onPress={() => router.push('/auth/register')} style={{ marginTop: 15 }}>
//           <Text style={s.link}>Create an account</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 22,
//     backgroundColor: '#F8F9FA',
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     padding: 28,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 4,
//     color: '#1E1E1E',
//   },
//   subtitle: {
//     textAlign: 'center',
//     marginBottom: 28,
//     color: '#6B6B6B',
//     fontSize: 14,
//   },
//   input: {
//     backgroundColor: '#F2F3F4',
//     padding: 14,
//     borderRadius: 12,
//     marginTop: 10,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   btnText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   link: {
//     color: '#4CAF50',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   err: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 4,
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import * as yup from 'yup';

// 🆕 Update validation schema for username
const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'), // 🆕 Changed from email
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
  const [username, setUsername] = useState(''); // 🆕 Changed from email
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    try {
      setErrors({});
      await loginSchema.validate({ username, password }, { abortEarly: false }); // 🆕 Use username
      
      const result = await login({ username, password }); // 🆕 Pass username
      
      if (result.type === 'auth/login/fulfilled') {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.payload as string);
      }
    } catch (error: any) {
      if (error.inner) {
        const newErrors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  // 🆕 Quick login for demo users
  const handleQuickLogin = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={s.header}>
          <Text style={[s.title, { color: theme.text }]}>Welcome Back</Text>
          <Text style={[s.subtitle, { color: theme.textSecondary }]}>
            Sign in to continue your wellness journey
          </Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          {/* 🆕 Username Input (instead of Email) */}
          <View style={s.inputContainer}>
            <Text style={[s.label, { color: theme.text }]}>Username</Text>
            <TextInput
              style={[
                s.input,
                { 
                  backgroundColor: theme.inputBackground,
                  borderColor: errors.username ? theme.error : theme.inputBorder,
                  color: theme.inputText
                }
              ]}
              placeholder="Enter your username"
              placeholderTextColor={theme.inputPlaceholder}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && (
              <Text style={[s.errorText, { color: theme.error }]}>{errors.username}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={s.inputContainer}>
            <Text style={[s.label, { color: theme.text }]}>Password</Text>
            <View style={s.passwordContainer}>
              <TextInput
                style={[
                  s.passwordInput,
                  { 
                    backgroundColor: theme.inputBackground,
                    borderColor: errors.password ? theme.error : theme.inputBorder,
                    color: theme.inputText
                  }
                ]}
                placeholder="Enter your password"
                placeholderTextColor={theme.inputPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={s.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={[s.errorText, { color: theme.error }]}>{errors.password}</Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              s.loginButton,
              { backgroundColor: theme.primary },
              isLoading && s.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Feather name="loader" size={20} color={theme.textInverse} />
            ) : (
              <Text style={[s.loginButtonText, { color: theme.textInverse }]}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* 🆕 Enhanced Demo Credentials with Quick Login Buttons */}
          <View style={[s.demoContainer, { borderColor: theme.border }]}>
            <Text style={[s.demoTitle, { color: theme.textSecondary }]}>
              Demo Users (DummyJSON):
            </Text>
            
            {/* User 1 */}
            <TouchableOpacity 
              style={[s.demoUserButton, { backgroundColor: theme.surface }]}
              onPress={() => handleQuickLogin('emilys', 'emilyspass')}
            >
              <View style={s.demoUserInfo}>
                <Text style={[s.demoUserName, { color: theme.text }]}>Emily Johnson</Text>
                <Text style={[s.demoUserCreds, { color: theme.textSecondary }]}>
                  emilys / emilyspass
                </Text>
              </View>
              <Feather name="log-in" size={16} color={theme.primary} />
            </TouchableOpacity>

            {/* User 2 */}
            <TouchableOpacity 
              style={[s.demoUserButton, { backgroundColor: theme.surface }]}
              onPress={() => handleQuickLogin('jamesd', 'jamesdpass')}
            >
              <View style={s.demoUserInfo}>
                <Text style={[s.demoUserName, { color: theme.text }]}>James Davis</Text>
                <Text style={[s.demoUserCreds, { color: theme.textSecondary }]}>
                  jamesd / jamesdpass
                </Text>
              </View>
              <Feather name="log-in" size={16} color={theme.primary} />
            </TouchableOpacity>


          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={[s.footerText, { color: theme.textSecondary }]}>
             {"Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={[s.footerLink, { color: theme.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  demoUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  demoUserInfo: {
    flex: 1,
  },
  demoUserName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  demoUserCreds: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});