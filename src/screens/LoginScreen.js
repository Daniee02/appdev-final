// src/screens/LoginScreen.js
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../App';
import { apiPostJson } from '../api/client';

export default function LoginScreen({ navigation }) {
  const { loginSuccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim() || !password) {
      return 'Please enter email and password.';
    }
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    if (!emailOk) {
      return 'Enter a valid email address.';
    }
    return null;
  };

  const onSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Check your details', error);
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiPostJson('login', {
        email: email.trim(),
        password,
      });
      console.log('LOGIN RES =>', res);
      if (res.success) {
        await loginSuccess(res.user);
      } else {
        Alert.alert('Login failed', res.error || 'Unknown error');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>🐟 Aqua Trade</Text>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>
          Sign in to view listings, chat, and manage your trades.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Your password"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.primaryButton, submitting && { opacity: 0.7 }]}
            onPress={onSubmit}
            disabled={submitting}
          >
            <Text style={styles.primaryText}>
              {submitting ? 'Logging in…' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 26,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  heading: {
    fontSize: 18,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  subheading: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 18,
    fontFamily: 'Inter_400Regular',
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  label: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    marginLeft: 4,
    fontFamily: 'Inter_500Medium',
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 12,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  primaryButton: {
    backgroundColor: '#0E8A8B',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryText: {
    color: '#f9fafb',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  linkText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#e5e7eb',
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular',
  },
});
