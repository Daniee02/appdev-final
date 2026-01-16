// src/screens/SettingsScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../App';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [localOnly, setLocalOnly] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('settings').then(raw => {
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.darkMode === 'boolean') setDarkMode(s.darkMode);
        if (typeof s.notifications === 'boolean') setNotifications(s.notifications);
        if (typeof s.localOnly === 'boolean') setLocalOnly(s.localOnly);
      }
    });
  }, []);

  const saveSettings = async next => {
    const current = { darkMode, notifications, localOnly, ...next };
    setDarkMode(current.darkMode);
    setNotifications(current.notifications);
    setLocalOnly(current.localOnly);
    await AsyncStorage.setItem('settings', JSON.stringify(current));
  };

  const toggleDarkMode = () => saveSettings({ darkMode: !darkMode });
  const toggleNotifications = () => saveSettings({ notifications: !notifications });
  const toggleLocalOnly = () => saveSettings({ localOnly: !localOnly });

  const onLogout = async () => {
    await logout();
  };

  const showAbout = () => {
    Alert.alert(
      'About Aqua Trade',
      'Aqua Trade connects fish buyers with local fishermen for direct, in-person trading.'
    );
  };

  const showHelp = () => {
    Alert.alert(
      'Help & support',
      'For now, contact the developer for support.\n\nLater you can add FAQs, support chat, or email links here.'
    );
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const goToPrivacy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const roleLabel = user?.user_type === 'fisherman' ? 'Fisherman' : 'Buyer';

  return (
    <View style={styles.screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with user info */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {user?.full_name ? `Hi, ${user.full_name}` : 'Hi there'}
            </Text>
            <Text style={styles.subGreeting}>Manage how Aqua Trade behaves on this device.</Text>
          </View>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>{roleLabel}</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>Dark mode</Text>
              <Text style={styles.caption}>
                Use a dark theme for all screens on this device.
              </Text>
            </View>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>Notifications</Text>
              <Text style={styles.caption}>
                Allow Aqua Trade to show order and message alerts.
              </Text>
            </View>
            <Switch value={notifications} onValueChange={toggleNotifications} />
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>Same-city only</Text>
              <Text style={styles.caption}>
                Prefer matches and listings from your city first.
              </Text>
            </View>
            <Switch value={localOnly} onValueChange={toggleLocalOnly} />
          </View>
        </View>

        {/* Tools */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tools</Text>

          <TouchableOpacity style={styles.itemRow} onPress={goToNotifications}>
            <View>
              <Text style={styles.itemLabel}>Manage notifications</Text>
              <Text style={styles.itemHint}>View recent alerts and mark them as read.</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.itemRow} onPress={showHelp}>
            <View>
              <Text style={styles.itemLabel}>Help & support</Text>
              <Text style={styles.itemHint}>FAQ and contact details (coming soon).</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <TouchableOpacity style={styles.itemRow} onPress={goToPrivacy}>
            <View>
              <Text style={styles.itemLabel}>Privacy policy</Text>
              <Text style={styles.itemHint}>How your data is used in Aqua Trade.</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.itemRow} onPress={showAbout}>
            <View>
              <Text style={styles.itemLabel}>About Aqua Trade</Text>
              <Text style={styles.itemHint}>
                Learn what this app does and who it is for.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App info footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Aqua Trade · v1.0.0</Text>
          <Text style={styles.footerTextMuted}>
            Built with Expo & React Native.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  container: { padding: 20, paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  subGreeting: {
    marginTop: 2,
    color: '#9ca3af',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#0E8A8B',
  },
  rolePillText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },

  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#111827',
  },
  sectionTitle: {
    fontSize: 15,
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  caption: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },

  separator: {
    height: 1,
    backgroundColor: '#111827',
    marginVertical: 6,
  },

  itemRow: {
    paddingVertical: 8,
  },
  itemLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  itemHint: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },

  logoutButton: {
    marginTop: 8,
    backgroundColor: '#ef4444',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },

  footer: {
    marginTop: 4,
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  footerTextMuted: {
    color: '#4b5563',
    fontSize: 11,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
});
