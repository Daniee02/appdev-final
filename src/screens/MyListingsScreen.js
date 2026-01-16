// src/screens/MyListingsScreen.js
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { apiGet } from '../api/client';

const IMAGE_BASE = 'http://10.20.20.249/aqua_trade/';

export default function MyListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);

  const loadMyListings = () => {
    apiGet('getmylistings')
      .then(data => {
        if (Array.isArray(data)) setListings(data);
        else setListings([]);
      })
      .catch(() => {
        Alert.alert('Error', 'Could not load your listings.');
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadMyListings);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {
    const total = parseFloat(item.total_price);
    const price = parseFloat(item.price_per_kg);
    const qty = parseFloat(item.quantity_kg);
    const imgUri = item.fish_image ? IMAGE_BASE + item.fish_image : null;
    

    return (
      <View style={styles.card}>
        {imgUri ? (
          <Image source={{ uri: imgUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View
            style={[
              styles.image,
              { alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' },
            ]}
          >
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>No image</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.title}>{item.fish_species}</Text>
          <Text style={styles.meta}>
            Qty {qty.toFixed(1)} kg · ₱{price.toFixed(2)} / kg · Total ₱{total.toFixed(2)}
          </Text>
          <Text style={styles.metaLight}>Status: {item.status}</Text>
          <Text style={styles.metaLight}>Delivery: {item.delivery_date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My listings</Text>
      <FlatList
        data={listings}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have not posted any listings yet.</Text>
        }
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
  screenTitle: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardBody: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#e5e7eb',
    fontFamily: 'Inter_400Regular',
    marginBottom: 2,
  },
  metaLight: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: 'Inter_400Regular',
  },
  emptyText: {
    marginTop: 20,
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
