// src/screens/MyPurchasesScreen.js
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiGet } from '../api/client';

export default function MyPurchasesScreen({ navigation }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiGet('getpurchases')
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {});
  }, []);

  const renderItem = ({ item }) => {
    const status = item.status || 'completed';
    const isCompleted = status === 'completed';
    const isCancelled = status === 'cancelled';
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

    let hint = '';
    if (isCompleted) {
      hint = 'Order completed. You can rate the seller.';
    } else if (isCancelled) {
      hint = 'Order cancelled. You cannot rate this order.';
    } else {
      hint = 'Waiting for meet-up. You can rate after completion.';
    }

    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{item.fish_species}</Text>
          <Text style={[styles.statusPill, styles[`status_${status}`]]}>
            {statusLabel}
          </Text>
        </View>

        <Text style={styles.meta}>
          Total ₱{parseFloat(item.total_price).toFixed(2)} · {item.created_at}
        </Text>
        <Text style={styles.metaLight}>
          Seller: {item.seller_name || 'Unknown'}
        </Text>

        <Text style={styles.hintText}>{hint}</Text>

        {isCompleted && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() =>
              navigation.navigate('RateSeller', {
                orderId: item.id,
                sellerId: item.seller_id,
                listingId: item.listing_id,
                existingRating: item.rating || 0,
                existingComment: item.comment || '',
              })
            }
          >
            <Text style={styles.rateButtonText}>
              {item.rating ? 'Edit review' : 'Rate seller'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My purchases</Text>
      <FlatList
        data={orders}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  screenTitle: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#111827',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  status_pending: {
    backgroundColor: '#fbbf24',
    color: '#1f2937',
  },
  status_completed: {
    backgroundColor: '#22c55e',
    color: '#022c22',
  },
  status_cancelled: {
    backgroundColor: '#ef4444',
    color: '#fef2f2',
  },
  meta: {
    marginTop: 4,
    color: '#e5e7eb',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  metaLight: {
    marginTop: 2,
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  hintText: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  rateButton: {
    marginTop: 10,
    backgroundColor: '#0E8A8B',
    borderRadius: 999,
    paddingVertical: 9,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
