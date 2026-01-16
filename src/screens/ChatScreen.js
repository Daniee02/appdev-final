// src/screens/ChatScreen.js
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../App';
import { apiGet, apiPost } from '../api/client';

const UPLOAD_URL = 'http://10.20.20.249/aqua_trade/upload_chat_image.php';
const PROFILE_BASE = 'http://10.20.20.249/aqua_trade/';

export default function ChatScreen({ route }) {
  const navigation = useNavigation();
  const [pendingImage, setPendingImage] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const { userId, fullName, profileImage } = route.params || {};
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  // Top of component – keep this
const isVerified = route.params?.is_verified ?? 0;


  const loadMessages = () => {
    apiGet('getmessages', { userid: userId })
      .then(data => {
        console.log('MESSAGES =>', data);
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(err => console.log('MESSAGES ERROR =>', err));
  };

  useEffect(() => {
    loadMessages();
  }, [userId]);

  const sendMessageToApi = async (content, imagePath = null) => {
    return apiPost('sendmessage', {
      receiverId: userId,
      messageText: content,
      imagePath,
    }).then(res => {
      console.log('SEND RES =>', res);
      if (res?.success) {
        loadMessages();
      } else {
        Alert.alert('Error', res?.error || 'Failed to send message');
      }
    });
  };

  const sendText = async () => {
    if (!text.trim() && !pendingImage) return;

    const body = text.trim();
    const imagePath = pendingImage;

    setText('');
    setPendingImage(null);

    await sendMessageToApi(body, imagePath);
  };

  const pickAndSendImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) return;

    const image = result.assets[0];

    try {
      const form = new FormData();
      form.append('image', {
        uri: image.uri,
        name: 'chat.jpg',
        type: 'image/jpeg',
      });

      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });

      const textRes = await res.text();
      console.log('UPLOAD RAW =>', textRes);
      const json = JSON.parse(textRes);

      if (!json.success || !json.url) {
        Alert.alert('Upload error', json.error || 'Failed to upload image');
        return;
      }

      setPendingImage(json.url);
    } catch (e) {
      console.log('UPLOAD ERROR =>', e);
      Alert.alert('Upload error', 'Could not upload image.');
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender_id === user.id;
    const isPhoto = !!item.image_path;
    const bodyText = item.message_text || '';
    const time = item.created_at ? item.created_at.slice(11, 16) : '';
    const isRead = item.is_read === 1;

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.rowRight : styles.rowLeft,
        ]}
      >
        <View
          style={[
            styles.bubbleWrapper,
            isMe && { alignItems: 'flex-end' },
          ]}
        >
          <View
            style={[
              styles.bubble,
              isMe ? styles.bubbleMe : styles.bubbleOther,
            ]}
          >
            {isPhoto ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setFullImage(
                    `http://10.20.20.249/aqua_trade/${item.image_path}`,
                  )
                }
              >
                <Image
                  source={{
                    uri: `http://10.20.20.249/aqua_trade/${item.image_path}`,
                  }}
                  style={styles.image}
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.messageText}>{bodyText}</Text>
            )}
          </View>
          <Text style={styles.timeText}>
            {time} {isMe && (isRead ? '✓✓' : '✓')}
          </Text>
        </View>
      </View>
    );
  };

  const avatarLetter = (fullName || 'U')[0].toUpperCase();
  const avatarUri = profileImage ? PROFILE_BASE + profileImage : null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {/* Top gradient header */}
        <View style={styles.headerBar}>
  <View style={styles.headerLeft}>
    {avatarUri ? (
      <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
    ) : (
      <View style={styles.headerAvatar}>
        <Text style={styles.headerAvatarText}>{avatarLetter}</Text>
      </View>
    )}
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={styles.headerName}>{fullName}</Text>
  {isVerified === 1 && (       // ✅ use the safe variable
    <View style={styles.headerVerified}>
      <Text style={styles.headerVerifiedText}>Verified</Text>
    </View>
  )}
</View>

      <Text style={styles.headerStatus}>Online</Text>
    </View>
  </View>


          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBack}
          >
            <Text style={styles.headerBackText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Info bar */}
        <View style={styles.infoBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PublicProfile', { userId })}
          >
            <Text style={styles.infoLink}>View profile</Text>
          </TouchableOpacity>

          <View style={styles.infoDivider} />

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RateSeller', {
                orderId: null,
                sellerId: userId,
                listingId: null,
                existingRating: 0,
                existingComment: '',
              })
            }
          >
            <Text style={styles.infoLink}>Rate seller</Text>
          </TouchableOpacity>
        </View>

        {/* Chat area */}
        <View style={styles.chatBackground}>
          <FlatList
            data={messages}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />

          {pendingImage && (
            <View style={styles.previewWrapper}>
              <Image
                source={{
                  uri: `http://10.20.20.249/aqua_trade/${pendingImage}`,
                }}
                style={styles.image}
              />
            </View>
          )}
        </View>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={pickAndSendImage}>
            <Text style={styles.iconText}>📷</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor="#6b7280"
            multiline
          />

          <TouchableOpacity style={styles.sendBtn} onPress={sendText}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Full-screen image */}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  },

  // header
  headerBar: {
    paddingTop: 4,          // was 8 or more; keep small
    marginTop: 6,           // NEW: add margin so it sits below status text
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: '#0b1120',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0E8A8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  headerAvatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  headerName: {
    color: '#f9fafb',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  headerStatus: {
    color: '#22c55e',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  headerBack: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackText: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  // ... keep the rest of your styles the same

  // info bar below header
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0b1120',
    backgroundColor: '#020617',
  },
  infoLink: {
    color: '#93c5fd',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  infoDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#1f2937',
    marginHorizontal: 14,
  },

  // chat area
  chatBackground: {
    flex: 1,
    backgroundColor: '#030712',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageRow: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  bubbleWrapper: {
    maxWidth: '80%',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  bubbleMe: {
    backgroundColor: '#0E8A8B',
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: '#111827',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  timeText: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 3,
    fontFamily: 'Inter_400Regular',
  },
  image: {
    width: 230,
    height: 230,
    borderRadius: 16,
    marginBottom: 2,
    backgroundColor: '#020617',
  },

  // input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#0b1120',
    backgroundColor: '#020617',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  iconText: {
    fontSize: 18,
    color: '#e5e7eb',
  },
  input: {
    flex: 1,
    maxHeight: 90,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  sendBtn: {
    marginLeft: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#0E8A8B',
    borderRadius: 20,
  },
  sendText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },

  previewWrapper: {
    paddingHorizontal: 12,
    paddingTop: 4,
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
