// src/screens/TransactionsScreen.js
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../App';
import { apiGet } from '../api/client';

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const isBuyer = user?.user_type === 'buyer';

  const loadTransactions = () => {
    setLoading(true);
    apiGet('gettransactions')
      .then(data => {
        console.log('TXNS =>', data);
        if (Array.isArray(data)) setItems(data);
        else setItems([]);
      })
      .catch(err => {
        console.log('TXNS ERROR =>', err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadTransactions);
    return unsub;
  }, [navigation]);

  const markCompleted = id => {
    setUpdatingId(id);
    apiGet('completetransaction', { id })
      .then(res => {
        console.log('COMPLETE RES =>', res);
        if (res?.success) {
          loadTransactions();
        }
      })
      .catch(err => console.log('COMPLETE ERR =>', err))
      .finally(() => setUpdatingId(null));
  };

  const cancelTransaction = id => {
    setUpdatingId(id);
    apiGet('canceltransaction', { id })
      .then(res => {
        console.log('CANCEL RES =>', res);
        if (res?.success) {
          loadTransactions();
        }
      })
      .catch(err => console.log('CANCEL ERR =>', err))
      .finally(() => setUpdatingId(null));
  };

  const openRate = item => {
    navigation.navigate('RateSeller', {
      orderId: item.id,
      // if I am buyer → I rate fisherman; if I am fisherman → I rate buyer
      sellerId: isBuyer ? item.fisherman_id : item.buyer_id,
      listingId: item.listing_id,
      existingRating: item.my_rating || 0,
      existingComment: item.my_comment || '',
    });
  };

  const renderItem = ({ item }) => {
    const status = item.status || 'pending';
    const otherName = item.full_name || 'Unknown';

    const canMarkCompleted = isBuyer && status === 'pending';
    const canCancel = isBuyer && status === 'pending';
    const canRate = status === 'completed' && !item.my_rating;

    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{item.fish_species}</Text>
          <Text style={[styles.statusPill, styles[`status_${status}`]]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>

        <Text style={styles.meta}>
          {item.quantity_kg} kg • ₱{parseFloat(item.amount).toFixed(2)}
        </Text>

        <Text style={styles.metaLight}>
          With {isBuyer ? 'fisherman' : 'buyer'}: {otherName}
        </Text>

        <View style={styles.actionsRow}>
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => cancelTransaction(item.id)}
              disabled={updatingId === item.id}
            >
              {updatingId === item.id ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.cancelText}>Cancel</Text>
              )}
            </TouchableOpacity>
          )}

          {canMarkCompleted && (
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => markCompleted(item.id)}
              disabled={updatingId === item.id}
            >
              {updatingId === item.id ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.completeText}>Mark completed</Text>
              )}
            </TouchableOpacity>
          )}

          {canRate && (
            <TouchableOpacity
              style={styles.rateBtn}
              onPress={() => openRate(item)}
            >
              <Text style={styles.rateText}>
                Rate {isBuyer ? 'fisherman' : 'buyer'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0E8A8B" />
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#9ca3af' }}>No transactions yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Transactions</Text>
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 18,
    padding: 12,
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
    fontSize: 15,
    color: '#e5e7eb',
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
    fontSize: 13,
    color: '#e5e7eb',
  },
  metaLight: {
    marginTop: 2,
    fontSize: 11,
    color: '#9ca3af',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  cancelText: {
    color: '#f97316',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  completeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#0E8A8B',
  },
  completeText: {
    color: '#f9fafb',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  rateBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  rateText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
