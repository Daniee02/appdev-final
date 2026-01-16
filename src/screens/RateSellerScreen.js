// src/screens/RateSellerScreen.js
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiPostJson } from '../api/client';
import RatingStars from '../components/RatingStars';

export default function RateSellerScreen({ route, navigation }) {
  const {
    orderId,
    sellerId,          // fisherman id
    existingRating = 0,
    existingComment = '',
  } = route.params;

  const [rating, setRating] = useState(existingRating || 0);
  const [comment, setComment] = useState(existingComment);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (!rating) {
      Alert.alert('Rating required', 'Please select 1–5 stars.');
      return;
    }

    const num = Number(rating);
    if (num < 1 || num > 5) {
      Alert.alert('Invalid rating', 'Rating must be between 1 and 5.');
      return;
    }

    try {
      setSaving(true);
      const res = await apiPostJson('submitreview', {
        reviewedUserId: sellerId,
        rating: num,
        comment,
        transactionId: orderId ?? null,
      });

      if (!res.success) {
        Alert.alert('Error', res.error || 'Could not save review.');
        return;
      }

      Alert.alert('Thank you', 'Your review was saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not save review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate your experience</Text>
      <Text style={styles.subtitle}>
        How was this seller? Your review helps other buyers on Aqua Trade.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Rating</Text>
        <RatingStars value={rating} onChange={setRating} />
        <Text style={styles.hint}>Tap a star from 1 to 5.</Text>

        <Text style={[styles.label, { marginTop: 18 }]}>Comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Share details about quality, timing, or communication..."
          placeholderTextColor="#6b7280"
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.6 }]}
          onPress={onSubmit}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {existingRating ? 'Update review' : 'Submit review'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: { fontSize: 22, color: '#ffffff', marginBottom: 4, fontFamily: 'Inter_700Bold' },
  subtitle: { color: '#9ca3af', fontSize: 13, marginBottom: 16, fontFamily: 'Inter_400Regular' },
  card: { backgroundColor: '#0f172a', borderRadius: 20, padding: 16 },
  label: { color: '#ffffff', fontSize: 14, marginBottom: 6, fontFamily: 'Inter_600SemiBold' },
  hint: { marginTop: 4, color: '#9ca3af', fontSize: 11, fontFamily: 'Inter_400Regular' },
  input: {
    marginTop: 6,
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 10,
    color: '#ffffff',
    fontSize: 13,
    textAlignVertical: 'top',
    fontFamily: 'Inter_400Regular',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#0E8A8B',
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
