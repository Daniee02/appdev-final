// src/screens/PrivacyPolicyScreen.js
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: January 2026</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Aqua Trade is a marketplace that connects fish buyers and fishermen. 
          This policy explains how basic information in your account is used inside the app.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Information we use</Text>
        <Text style={styles.text}>
          We use the details you provide, such as your name, phone number, city, and listings, 
          to help buyers and fishermen contact each other and arrange trades.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. How information is shared</Text>
        <Text style={styles.text}>
          Your profile information and listings can be seen by other Aqua Trade users. 
          Your password is never shown to other users.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Your choices</Text>
        <Text style={styles.text}>
          You can update your profile details at any time from the Profile screen. 
          You may also request that your account be removed by contacting the developer.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.text}>
          For questions about this policy, please contact the Aqua Trade developer.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 32 },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  updated: {
    color: '#9ca3af',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#e5e7eb',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  text: {
    color: '#9ca3af',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
  },
});
