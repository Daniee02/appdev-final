// src/screens/LandingScreen.js
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topBadge}>
        <Text style={styles.badgeText}>Marketplace for fresh catch</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.logo}>🐟 Aqua Trade</Text>
        <Text style={styles.subtitle}>Fresh seafood from local fishermen, in one modern app.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Buy & sell fish in real time</Text>
        <Text style={styles.text}>
          Browse live listings, chat with trusted partners, and keep all transactions in one dashboard.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryText}>Create free account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryText}>I already have an account</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerNote}>
        Built for busy fish buyers & fishermen who want less calls and more clear deals.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    justifyContent: 'center',
  },
  topBadge: {
    position: 'absolute',
    top: 54,
    left: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#0f172a',
  },
  badgeText: {
    fontSize: 11,
    color: '#e5e7eb',
    fontFamily: 'Inter_400Regular',
  },
  header: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 30,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    marginTop: 8,
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  card: {
    backgroundColor: '#0E8A8B',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
  },
  title: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  text: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryText: {
    color: '#0E8A8B',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  footerNote: {
    marginTop: 18,
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
