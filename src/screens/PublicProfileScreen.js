// src/screens/PublicProfileScreen.js
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { apiGet } from '../api/client';

const IMAGE_BASE = 'http://10.20.20.249/aqua_trade/';

export default function PublicProfileScreen({ route }) {
  const { userId } = route.params || {};
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (!userId) return;

    apiGet('getpublicprofile', { userid: userId })
      .then(data => {
        setProfile(data && data.id ? data : null);
      })
      .catch(err => {
        console.log('PUBLIC PROFILE ERROR =>', err);
        setProfile(null);
      })
      .finally(() => setLoading(false));

    // load reviews for this user
    setLoadingReviews(true);
    apiGet('getreviews', { userid: userId })
      .then(data => {
        if (Array.isArray(data)) setReviews(data);
        else setReviews([]);
      })
      .catch(err => {
        console.log('REVIEWS ERROR =>', err);
        setReviews([]);
      })
      .finally(() => setLoadingReviews(false));
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0E8A8B" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#e5e7eb' }}>User not found.</Text>
      </View>
    );
  }

  const avatarLetter = (profile.full_name || 'U')[0].toUpperCase();
  const profileImageUri = profile.profile_image
    ? IMAGE_BASE + profile.profile_image
    : null;
  const ratingNumber =
    profile.rating != null ? Number(profile.rating) : 0;
  const ratingLabel = reviews.length
    ? `⭐ ${ratingNumber.toFixed(2)} • ${reviews.length} reviews`
    : 'No reviews yet';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View style={styles.heroCard}>
        <View style={styles.avatarWrapper}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{avatarLetter}</Text>
            </View>
          )}

          <Text style={styles.name}>{profile.full_name}</Text>

          {profile.is_verified === 1 && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          <Text style={styles.email}>{profile.email}</Text>

          <View style={styles.badgesRow}>
            <View style={styles.badgePrimary}>
              <Text style={styles.badgePrimaryText}>
                {profile.user_type === 'fisherman' ? 'Fisherman' : 'Buyer'}
              </Text>
            </View>
            <View style={styles.badgeMuted}>
              <Text style={styles.badgeMutedText}>
                {ratingLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{profile.city || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{profile.phone_number || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>
              {profile.address || '—'}
            </Text>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>

          {loadingReviews ? (
            <ActivityIndicator size="small" color="#0E8A8B" />
          ) : !reviews.length ? (
            <Text style={styles.emptyReviews}>No reviews yet.</Text>
          ) : (
            reviews.slice(0, 5).map((rev, index) => (
              <View
                key={rev.id || index}
                style={[
                  styles.reviewRow,
                  index === reviews.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>
                    {rev.reviewer_name || 'Anonymous'}
                  </Text>
                  <Text style={styles.reviewRating}>⭐ {rev.rating}</Text>
                </View>
                {rev.comment ? (
                  <Text style={styles.reviewComment} numberOfLines={3}>
                    {rev.comment}
                  </Text>
                ) : null}
                {rev.created_at ? (
                  <Text style={styles.reviewDate}>{rev.created_at}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  heroCard: {
    margin: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#111827',
  },
  avatarWrapper: { alignItems: 'center', marginBottom: 16 },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarInitial: {
    fontSize: 40,
    color: '#ffffff',
    fontFamily: 'Inter_700Bold',
  },
  avatarImage: { width: 96, height: 96, borderRadius: 48, marginBottom: 10 },
  name: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  email: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  badgePrimary: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#0E8A8B',
  },
  badgePrimaryText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  badgeMuted: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  badgeMutedText: {
    color: '#fbbf24',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    marginTop: 8,
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#111827',
  },
  sectionTitle: {
    color: '#e5e7eb',
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Inter_600SemiBold',
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
  infoValue: {
    color: '#e5e7eb',
    fontSize: 13,
    maxWidth: '60%',
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },
  verifiedBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#16a34a',
    alignSelf: 'center',
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyReviews: {
    color: '#9ca3af',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  reviewRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  reviewerName: {
    color: '#e5e7eb',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  reviewRating: {
    color: '#fbbf24',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  reviewComment: {
    color: '#d1d5db',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  reviewDate: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
});
