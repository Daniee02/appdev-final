// src/screens/ProfileScreen.js
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../App';
import { apiGet, apiPost } from '../api/client';

const IMAGE_BASE = 'http://10.20.20.249/aqua_trade/';

export default function ProfileScreen({ route }) {
  const { user } = useAuth();
  const viewedUserId = route?.params?.userId || user.id;

  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [localPhotoUri, setLocalPhotoUri] = useState(null);

  const isOwnProfile = viewedUserId === user.id;

  const loadProfile = () => {
    setLoading(true);
    apiGet('profile', { userid: viewedUserId })
      .then(data => {
        setProfile(data || {});
        if (data && isOwnProfile) {
          setEditName(data.full_name || '');
          setEditPhone(data.phone_number || '');
          setEditCity(data.city || '');
          setEditAddress(data.address || '');
          setLocalPhotoUri(null);
        }
      })
      .catch(() => {
        setProfile(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, [viewedUserId]);

  const current = profile || {};
  const fullName = current.full_name || '—';
  const email = current.email || '—';
  const city = current.city || '—';
  const address = current.address || '—';
  const phone = current.phone_number || '—';
  const type = current.user_type === 'fisherman' ? 'Fisherman' : 'Buyer';
  const rating = current.rating ?? '0.00';
  const totalReviews = current.total_reviews ?? 0;
  const completedDeals = current.completed_deals ?? 0;

  const avatarLetter = fullName ? fullName[0].toUpperCase() : 'A';
  const storedProfileImageUri = current.profile_image
    ? IMAGE_BASE + current.profile_image
    : null;
  const displayProfileImageUri = localPhotoUri || storedProfileImageUri;

  const onChangePhoto = async () => {
    if (!isOwnProfile || !editing) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Allow access to photos to upload a profile picture.',
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled || !result.assets?.length) return;

    const image = result.assets[0];
    setLocalPhotoUri(image.uri);
  };

  const saveProfile = async () => {
    if (!editName || !editPhone || !editCity || !editAddress) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    try {
      setSaving(true);

      const form = new FormData();
      form.append('fullName', editName);
      form.append('phone', editPhone);
      form.append('address', editAddress);
      form.append('city', editCity);

      if (localPhotoUri) {
        const filename = localPhotoUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        form.append('profileImage', {
          uri: localPhotoUri,
          name: filename,
          type,
        });
      }

      const res = await apiPost('updateprofile', form);
      if (!res.success) {
        Alert.alert('Error', res.error || 'Failed to update profile');
        return;
      }

      Alert.alert('Updated', 'Profile updated.');
      setEditing(false);
      loadProfile();
    } catch (e) {
      console.log('UPDATE PROFILE ERROR =>', e);
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#0E8A8B" style={{ marginBottom: 8 }} />
        <Text style={{ color: '#9ca3af', fontSize: 13 }}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.screenTitle}>
            {isOwnProfile ? 'My profile' : 'User profile'}
          </Text>
          <Text style={styles.screenSubtitle}>
            Overview of your AquaTrade identity.
          </Text>
        </View>
        {isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.editChip,
              editing && { backgroundColor: '#0E8A8B', borderColor: '#0E8A8B' },
            ]}
            onPress={() => {
              if (editing) {
                loadProfile();
              }
              setEditing(prev => !prev);
            }}
            disabled={saving}
          >
            <Text
              style={[
                styles.editChipText,
                editing && { color: '#f9fafb' },
              ]}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Rating</Text>
          <Text style={styles.summaryValue}>{rating}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Reviews</Text>
          <Text style={styles.summaryValue}>{totalReviews}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Completed</Text>
          <Text style={styles.summaryValue}>{completedDeals}</Text>
        </View>
      </View>

      {/* Main profile card */}
      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          {displayProfileImageUri ? (
            <Image source={{ uri: displayProfileImageUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{avatarLetter}</Text>
            </View>
          )}

          {isOwnProfile && (
            <TouchableOpacity
              onPress={onChangePhoto}
              disabled={saving || !editing}
            >
              <Text
                style={[
                  styles.changePhotoText,
                  (!editing || saving) && { opacity: 0.4 },
                ]}
              >
                {saving ? 'Saving…' : 'Change photo'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{type}</Text>
          </View>
          {current.is_verified === 1 && (
            <View style={[styles.badge, { backgroundColor: '#16a34a' }]}>
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionDivider} />

        {isOwnProfile ? (
          <>
            <View style={styles.fieldGroup}>
              <Text style={styles.infoLabel}>Full name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                editable={editing}
                onChangeText={setEditName}
                placeholder="Your full name"
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.infoLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  editable={editing}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  placeholder="09xxxxxxxxx"
                  placeholderTextColor="#6b7280"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.infoLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={editCity}
                  editable={editing}
                  onChangeText={setEditCity}
                  placeholder="City / town"
                  placeholderTextColor="#6b7280"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.infoLabel}>Address</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={editAddress}
                editable={editing}
                onChangeText={setEditAddress}
                multiline
                placeholder="Street, barangay"
                placeholderTextColor="#6b7280"
              />
            </View>

            {editing && (
              <TouchableOpacity
                style={[styles.saveButton, saving && { opacity: 0.7 }]}
                onPress={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save changes</Text>
                )}
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{city}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{phone}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.secondaryCard}>
        <Text style={styles.sectionTitle}>Account info</Text>
        <Text style={styles.sectionText}>
          Keep your details accurate to make it easier to schedule meetups and
          maintain trust with other AquaTrade members.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  editChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#0E8A8B',
  },
  editChipText: {
    color: '#0E8A8B',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  summaryStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: '#9ca3af',
    fontSize: 11,
    marginBottom: 2,
    fontFamily: 'Inter_400Regular',
  },
  summaryValue: {
    color: '#e5e7eb',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },

  card: {
    backgroundColor: '#020617',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#111827',
  },

  avatarWrapper: { alignItems: 'center', marginBottom: 10 },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarInitial: {
    fontSize: 40,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  changePhotoText: {
    color: '#93c5fd',
    fontSize: 13,
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400Regular',
  },

  name: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: 'Inter_700Bold',
  },
  email: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Inter_400Regular',
  },

  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#0E8A8B',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },

  sectionDivider: {
    height: 1,
    backgroundColor: '#111827',
    marginVertical: 10,
  },

  fieldGroup: {
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },

  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
    paddingHorizontal: 10,
    paddingVertical: 7,
    color: '#f9fafb',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
  },

  infoValue: {
    color: '#e5e7eb',
    fontSize: 13,
    maxWidth: '60%',
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },

  secondaryCard: {
    backgroundColor: '#020617',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#111827',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionText: {
    color: '#9ca3af',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },

  saveButton: {
    marginTop: 8,
    backgroundColor: '#0E8A8B',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
