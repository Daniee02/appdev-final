// src/screens/InboxScreen.js
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

export default function InboxScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInbox = () => {
    if (!user) return;
    setLoading(true);
    apiGet('getinbox')
      .then(data => {
        console.log('INBOX DATA =>', data);
        if (Array.isArray(data)) setConversations(data);
        else setConversations([]);
      })
      .catch(err => {
        console.log('GETINBOX ERROR =>', err);
        setConversations([]);
      })
      .finally(() => setLoading(false));
  };

  // simple effect: load once when screen mounts
  useEffect(() => {
    loadInbox();
  }, [user?.id]);

  const openChat = conv => {
    navigation.navigate('Chat', {
      userId: conv.user_id,
      fullName: conv.full_name,
      profileImage: conv.profile_image ?? null,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => openChat(item)}>
      <View style={styles.itemText}>
        <Text style={styles.name}>{item.full_name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message || 'No messages yet'}
        </Text>
      </View>
      {item.unread_count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread_count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0E8A8B" />
      </View>
    );
  }

  if (!conversations.length) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#9ca3af' }}>No messages yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={item => String(item.user_id)}
        renderItem={renderItem}
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
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  itemText: { flex: 1 },
  name: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  lastMessage: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
  badge: {
    minWidth: 22,
    paddingHorizontal: 6,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
});
