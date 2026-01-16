// src/screens/NotificationsScreen.js
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiGet, apiPost } from '../api/client';

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = () => {
    setLoading(true);
    apiGet('getnotifications')
      .then(data => {
        console.log('NOTIFICATIONS DATA =>', data);
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      })
      .catch(err => {
        console.log('NOTIFICATIONS ERROR =>', err);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = id => {
    setItems(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: 1 } : n)),
    );

    apiPost('readnotification', { id })
      .then(() => {
        // optional: reload to sync with server
        loadNotifications();
      })
      .catch(err => {
        console.log('READ NOTIFICATION ERROR =>', err);
      });
  };

  const renderItem = ({ item }) => {
    const isUnread = Number(item.is_read) === 0;
    return (
      <TouchableOpacity
        style={[styles.item, isUnread && styles.itemUnread]}
        onPress={() => markAsRead(item.id)}
      >
        <Text
          style={[
            styles.message,
            isUnread && styles.messageUnread,
          ]}
        >
          {item.message}
        </Text>
        <Text style={styles.time}>{item.created_at}</Text>
      </TouchableOpacity>
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
        <Text style={{ color: '#9ca3af' }}>No notifications yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  center: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  item: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#020617',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#111827',
  },
  itemUnread: {
    borderColor: '#0E8A8B',
  },
  message: {
    color: '#e5e7eb',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  messageUnread: {
    fontFamily: 'Inter_600SemiBold',
  },
  time: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
});
