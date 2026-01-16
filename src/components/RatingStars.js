// src/components/RatingStars.js
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RatingStars({ value, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map(star => {
        const isActive = star <= (value || 0);
        return (
          <TouchableOpacity
            key={star}
            onPress={() => onChange && onChange(star)}
            activeOpacity={0.7}
          >
            <Text style={[styles.star, isActive ? styles.starActive : styles.starInactive]}>
              ★
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 24,
    marginRight: 4,
  },
  starActive: {
    color: '#fbbf24', // yellow
  },
  starInactive: {
    color: '#4b5563', // gray
  },
});
