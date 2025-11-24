// import React from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function Register() {
//   const router = useRouter();

//   const onRegister = () => {
//     Alert.alert('Registered (mock)', 'Please login');
//     router.replace('/auth/login');
//   };

//   return (
//     <View style={s.screen}>
//       <View style={s.card}>
//         <Text style={s.title}>Create Account</Text>
//         <Text style={s.subtitle}>Join NutriGuide+ today</Text>

//         <TextInput placeholder="Email" style={s.input} autoCapitalize="none" keyboardType="email-address" />
//         <TextInput placeholder="Password" secureTextEntry style={s.input} />

//         <TouchableOpacity style={s.button} onPress={onRegister}>
//           <Text style={s.btnText}>Register</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push('/auth/login')} style={{ marginTop: 15 }}>
//           <Text style={s.link}>Already have an account? Login</Text>
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
//     fontSize: 28,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginBottom: 4,
//     color: '#1E1E1E',
//   },
//   subtitle: {
//     textAlign: 'center',
//     marginBottom: 20,
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

const registerSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { register, login } = useAuth();
  const { theme } = useTheme();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    try {
      setErrors({});
      await registerSchema.validate(formData, { abortEarly: false });
      
      // Show loading
      setIsLoading(true);
      
      // Mock registration - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After "registration", automatically login with a demo user
      const result = await login({ 
        username: 'emilys', // Use Emily Johnson's credentials
        password: 'emilyspass' 
      });
      
      if (result.type === 'auth/login/fulfilled') {
        Alert.alert('Success', `Welcome ${formData.name}! Your account has been created and you are now logged in.`);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Registration Complete', 'Account created! Please login with your credentials.');
        router.push('/auth/login');
      }
    } catch (error: any) {
      if (error.inner) {
        const newErrors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        Alert.alert('Registration Failed', 'Unable to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[s.container, { backgroundColor: theme.background }]}>
        <View style={s.header}>
          <Text style={[s.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[s.subtitle, { color: theme.textSecondary }]}>
            Start your wellness journey today
          </Text>
        </View>

        <View style={s.form}>
          {/* Name Input */}
          <View style={s.inputContainer}>
            <Text style={[s.label, { color: theme.text }]}>Full Name</Text>
            <TextInput
              style={[
                s.input,
                { 
                  backgroundColor: theme.inputBackground,
                  borderColor: errors.name ? theme.error : theme.inputBorder,
                  color: theme.inputText
                }
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={theme.inputPlaceholder}
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
            />
            {errors.name && <Text style={[s.errorText, { color: theme.error }]}>{errors.name}</Text>}
          </View>
          
          {/* Username Input */}
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
              placeholder="Choose a username"
              placeholderTextColor={theme.inputPlaceholder}
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && <Text style={[s.errorText, { color: theme.error }]}>{errors.username}</Text>}
          </View>

          {/* Email Input */}
          <View style={s.inputContainer}>
            <Text style={[s.label, { color: theme.text }]}>Email Address</Text>
            <TextInput
              style={[
                s.input,
                { 
                  backgroundColor: theme.inputBackground,
                  borderColor: errors.email ? theme.error : theme.inputBorder,
                  color: theme.inputText
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={theme.inputPlaceholder}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={[s.errorText, { color: theme.error }]}>{errors.email}</Text>}
          </View>

          {/* Password Input - SIMPLIFIED VERSION */}
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
                placeholder="Create a password"
                placeholderTextColor={theme.inputPlaceholder}
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
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
            {errors.password && <Text style={[s.errorText, { color: theme.error }]}>{errors.password}</Text>}
          </View>

          {/* Confirm Password Input - SIMPLIFIED VERSION */}
          <View style={s.inputContainer}>
            <Text style={[s.label, { color: theme.text }]}>Confirm Password</Text>
            <View style={s.passwordContainer}>
              <TextInput
                style={[
                  s.passwordInput,
                  { 
                    backgroundColor: theme.inputBackground,
                    borderColor: errors.confirmPassword ? theme.error : theme.inputBorder,
                    color: theme.inputText
                  }
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={theme.inputPlaceholder}
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={s.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Feather 
                  name={showConfirmPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={[s.errorText, { color: theme.error }]}>{errors.confirmPassword}</Text>
            )}
          </View>


          {/* Register Button */}
          <TouchableOpacity
            style={[
              s.registerButton,
              { backgroundColor: theme.primary },
              isLoading && s.buttonDisabled
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={s.loadingContainer}>
                <Feather name="loader" size={20} color={theme.textInverse} />
                <Text style={[s.registerButtonText, { color: theme.textInverse }]}>
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text style={[s.registerButtonText, { color: theme.textInverse }]}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={s.footer}>
          <Text style={[s.footerText, { color: theme.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={[s.footerLink, { color: theme.primary }]}>
              Sign In
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
  demoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
  },
  demoNoteTextContainer: {
    flex: 1,
  },
  demoNoteText: {
    fontSize: 12,
    lineHeight: 16,
  },
  registerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
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