// src/screens/ListingsScreen.js
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../App';
import { apiGet, apiPost } from '../api/client';

const IMAGE_BASE = 'http://10.20.20.249/aqua_trade/';

export default function ListingsScreen({ navigation }) {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [fullImage, setFullImage] = useState(null);

  const isFisherman = user?.user_type === 'fisherman';

  useEffect(() => {
    apiGet('getlistings')
      .then(data => {
        if (Array.isArray(data)) {
          setListings(data);
          setFiltered(data);
        }
      })
      .catch(() => {});
  }, []);

  const applyFilter = (text, sourceData = listings) => {
    const q = text.trim().toLowerCase();
    if (!q) {
      setFiltered(sourceData);
      return;
    }
    const result = sourceData.filter(item => {
      const species = (item.fish_species || '').toLowerCase();
      const city = (item.city || '').toLowerCase();
      return species.includes(q) || city.includes(q);
    });
    setFiltered(result);
  };

  const onChangeSearch = text => {
    setSearch(text);
    applyFilter(text);
  };

  const createOrder = item => {
    if (!isFisherman) return;

    apiPost('createorder', {
      listingId: item.id,
      amount: parseFloat(item.total_price) || 0,
    })
      .then(res => {
        if (res?.success) {
          Alert.alert('Order created', 'You can see it in Transactions.');
          navigation.navigate('Transactions');
        } else {
          Alert.alert('Error', res?.error || 'Failed to create order');
        }
      })
      .catch(() =>
        Alert.alert('Error', 'Could not create order, please try again.'),
      );
  };

  const renderItem = ({ item }) => {
    const total = parseFloat(item.total_price);
    const price = parseFloat(item.price_per_kg);
    const qty = parseFloat(item.quantity_kg);

    const imgUri = item.fish_image ? IMAGE_BASE + item.fish_image : null;
    const rating = item.rating ?? null;
    const reviews = item.total_reviews ?? 0;
    const isVerified = item.is_verified ?? 0;

    return (
      <View style={styles.card}>
        {/* Image */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => imgUri && setFullImage(imgUri)}
        >
          {imgUri ? (
            <Image
              source={{ uri: imgUri }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Text style={styles.cardImagePlaceholderText}>No image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.cardRight}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.fish_species}
            </Text>
            <Text style={styles.price}>₱{price.toFixed(2)}/kg</Text>
          </View>

          <Text style={styles.meta} numberOfLines={1}>
            {item.city} • {qty.toFixed(1)} kg • Total ₱{total.toFixed(2)}
          </Text>

          {/* Buyer + verified */}
          <View style={styles.tagsRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PublicProfile', {
                  userId: item.buyer_id,
                })
              }
            >
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>
                  Buyer: {item.full_name || 'Unknown'}
                </Text>
              </View>
            </TouchableOpacity>

            {isVerified === 1 && (
              <View style={styles.tagVerified}>
                <Text style={styles.tagVerifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {/* Rating + actions */}
          <View style={styles.footerRow}>
            <Text style={styles.ratingText}>
              ⭐ {rating ? Number(rating).toFixed(1) : 'New'} ({reviews})
            </Text>

            {isFisherman ? (
              <View style={styles.actionsRight}>
                {/* Primary: message */}
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() =>
                    navigation.navigate('ChatScreen', {
                      userId: item.buyer_id,
                      fullName: item.full_name,
                      is_verified: isVerified ?? 0,
                    })
                  }
                >
                  <Text style={styles.primaryText}>Message</Text>
                </TouchableOpacity>

                {/* Secondary: small icon order button */}
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => createOrder(item)}
                >
                  <Text style={styles.iconBtnText}>✓</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.ctaButtonSecondary}
                onPress={() =>
                  navigation.navigate('PublicProfile', {
                    userId: item.buyer_id,
                  })
                }
              >
                <Text style={styles.ctaSecondaryText}>View profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Live listings</Text>

      <View style={styles.searchWrapper}>
        <TextInput
          value={search}
          onChangeText={onChangeSearch}
          placeholder="Search fish or city..."
          placeholderTextColor="#6b7280"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {fullImage && (
        <View style={styles.fullOverlay}>
          <TouchableOpacity
            style={styles.fullOverlay}
            activeOpacity={1}
            onPress={() => setFullImage(null)}
          >
            <Image source={{ uri: fullImage }} style={styles.fullImage} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 8,
    paddingHorizontal: 16,
    fontFamily: 'Inter_700Bold',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#020617',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#e5e7eb',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },

  card: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#020617',
  },
  cardImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholderText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  cardRight: {
    flex: 1,
    marginLeft: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: '#e5e7eb',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  price: {
    color: '#22c55e',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginLeft: 8,
  },
  meta: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },

  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    marginRight: 6,
  },
  tagText: {
    color: '#e5e7eb',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  tagVerified: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#16a34a',
  },
  tagVerifiedText: {
    color: '#ecfdf5',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    color: '#9ca3af',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },

  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#0E8A8B',
  },
  primaryText: {
    color: '#f9fafb',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  iconBtn: {
    marginLeft: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  iconBtnText: {
    color: '#0E8A8B',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },

  ctaButtonSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  ctaSecondaryText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },

  fullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  fullImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});
