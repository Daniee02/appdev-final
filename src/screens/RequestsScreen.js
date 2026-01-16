// src/screens/RequestsScreen.js
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { apiGet } from '../api/client';

const IMAGE_BASE = 'http://10.20.20.249/aqua_trade/';

export default function RequestsScreen() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    apiGet('getrequests')
      .then(data => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch(() => {});
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_path ? (
        <Image
          source={{ uri: IMAGE_BASE + item.image_path }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.body}>
        <Text style={styles.title}>{item.fish_species}</Text>
        <Text style={styles.meta}>
          {parseFloat(item.quantity_kg).toFixed(1)} kg · wants ₱
          {parseFloat(item.desired_price_per_kg).toFixed(2)} / kg
        </Text>
        <Text style={styles.metaLight}>{item.city}</Text>
        {item.buyer_name && (
          <Text style={styles.metaLight}>Buyer: {item.buyer_name}</Text>
        )}
        {item.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Buyer requests</Text>
     <FlatList
        data={requests}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
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
    backgroundColor: '#0f172a',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  image: { width: '100%', height: 160 },
  body: { padding: 12 },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
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
  notes: {
    marginTop: 6,
    color: '#e5e7eb',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
