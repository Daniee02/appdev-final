// src/screens/MessagesScreen.js
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiGet } from '../api/client';

const IMAGE_BASE = 'http://10.20.20.249/aqua_trade/';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadThreads = () => {
    setLoading(true);
    apiGet('getinbox')
      .then(data => {
        console.log('INBOX DATA =>', data);
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) =>
            (b.last_created_at || '').localeCompare(a.last_created_at || ''),
          );
          setThreads(sorted);
        } else {
          setThreads([]);
        }
      })
      .catch(err => {
        console.log('INBOX ERROR =>', err);
        setThreads([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadThreads);
    return unsubscribe;
  }, [navigation]);

  const openChat = item => {
    navigation.navigate('ChatScreen', {
      userId: item.user_id,
      fullName: item.full_name,
      profileImage: item.profile_image ?? null,
      is_verified: item.is_verified ?? 0,
    });
  };

  const renderItem = ({ item }) => {
    const letter = (item.full_name || 'U')[0].toUpperCase();
    const avatarUri = item.profile_image ? IMAGE_BASE + item.profile_image : null;

    return (
      <TouchableOpacity style={styles.thread} onPress={() => openChat(item)}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{letter}</Text>
          </View>
        )}

        <View style={styles.threadText}>
          <View style={styles.threadTopRow}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {item.full_name}
              </Text>
              {item.is_verified === 1 && (
                <View style={styles.verifiedPill}>
                  <Text style={styles.verifiedPillText}>Verified</Text>
                </View>
              )}
            </View>

            <Text style={styles.time}>
              {item.last_created_at?.slice(5, 16) || ''}
            </Text>
          </View>

          <View style={styles.threadBottomRow}>
            <Text style={styles.preview} numberOfLines={1}>
              {item.last_message || 'No messages yet'}
            </Text>
            {item.unread_count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread_count}</Text>
              </View>
            )}
          </View>
        </View>
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

  if (!threads.length) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#9ca3af' }}>No messages yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <FlatList
          data={threads}
          keyExtractor={item => String(item.user_id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  center: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#f9fafb',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginTop: 6,
    marginBottom: 14,
  },
  thread: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#030712',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  threadText: { flex: 1 },
  threadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  name: {
    color: '#e5e7eb',
    fontSize: 15,
    fontWeight: '600',
  },
  verifiedPill: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#16a34a',
  },
  verifiedPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  time: {
    color: '#6b7280',
    fontSize: 11,
  },
  threadBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  preview: {
    color: '#9ca3af',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    minWidth: 22,
    paddingHorizontal: 6,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  headerVerified: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#16a34a',
  },
  headerVerifiedText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
});
