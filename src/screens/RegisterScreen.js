// src/screens/RegisterScreen.js
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
import { apiPostJson } from '../api/client';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!fullName.trim()) {
      return 'Full name is required.';
    }
    if (!email.trim()) {
      return 'Email is required.';
    }
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    if (!emailOk) {
      return 'Enter a valid email address.';
    }
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (!city.trim()) {
      return 'City is required.';
    }
    return null;
  };

  const onSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Check your details', error);
      return;
    }

    const body = {
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      userType,
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
    };

    try {
      setSubmitting(true);
      const res = await apiPostJson('register', body);
      if (res.success) {
        Alert.alert('Account created', 'You can now log in.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Registration failed', res.error || 'Unknown error');
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
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subheading}>
          Join as a buyer or fisherman and start trading fresh catch.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Dela Cruz"
            placeholderTextColor="#6b7280"
            value={fullName}
            onChangeText={setFullName}
          />

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
            placeholder="Minimum 6 characters"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="09xx xxx xxxx"
            placeholderTextColor="#6b7280"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Quezon City"
            placeholderTextColor="#6b7280"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>Address (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Street, barangay"
            placeholderTextColor="#6b7280"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>Account type</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeChip,
                userType === 'buyer' && styles.typeChipActive,
              ]}
              onPress={() => setUserType('buyer')}
            >
              <Text
                style={[
                  styles.typeText,
                  userType === 'buyer' && styles.typeTextActive,
                ]}
              >
                Buyer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeChip,
                userType === 'fisherman' && styles.typeChipActive,
              ]}
              onPress={() => setUserType('fisherman')}
            >
              <Text
                style={[
                  styles.typeText,
                  userType === 'fisherman' && styles.typeTextActive,
                ]}
              >
                Fisherman
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, submitting && { opacity: 0.7 }]}
            onPress={onSubmit}
            disabled={submitting}
          >
            <Text style={styles.primaryText}>
              {submitting ? 'Creating account…' : 'Create account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Already have an account? Login
            </Text>
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
    marginBottom: 10,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeChip: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginHorizontal: 3,
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  typeChipActive: {
    backgroundColor: '#0E8A8B',
    borderColor: '#0E8A8B',
  },
  typeText: {
    color: '#9ca3af',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  typeTextActive: {
    color: '#f9fafb',
  },
  primaryButton: {
    backgroundColor: '#0E8A8B',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
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
