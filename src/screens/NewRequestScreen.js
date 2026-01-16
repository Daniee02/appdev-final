// src/screens/NewRequestScreen.js
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { apiPost } from '../api/client';

export default function NewRequestScreen({ navigation }) {
  const [fish, setFish] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photos to attach a fish image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const onSubmit = async () => {
    if (!fish || !quantityKg || !pricePerKg || !city) {
      Alert.alert('Missing info', 'Please fill fish, kg, price, and city.');
      return;
    }

    try {
      setSaving(true);

      // FormData for PHP createlisting (expects fishSpecies, quantityKg, pricePerKg, deliveryDate, fishImage)
      const form = new FormData();
      form.append('fishSpecies', fish);
      form.append('quantityKg', quantityKg);
      form.append('pricePerKg', pricePerKg);
      // reuse city as deliveryDate text for now, or replace with real date input
      form.append('deliveryDate', city);

      if (image) {
        form.append('fishImage', {
          uri: image.uri,
          name: 'listing.jpg',
          type: 'image/jpeg',
        });
      }

      const res = await apiPost('createlisting', form);
      console.log('CREATE LISTING RES =>', res);

      if (!res.success) {
        Alert.alert('Error', res.error || 'Failed to create listing');
        return;
      }

      Alert.alert('Posted', 'Your request is now in Live listings.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not post listing. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Post what you want to buy</Text>
      <Text style={styles.subtitle}>
        Buyers can describe the fish they need so local fishermen can respond.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Fish species</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Yellowfin tuna"
          placeholderTextColor="#6b7280"
          value={fish}
          onChangeText={setFish}
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Quantity (kg)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 50"
              placeholderTextColor="#6b7280"
              value={quantityKg}
              onChangeText={setQuantityKg}
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Desired price / kg</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 180"
              placeholderTextColor="#6b7280"
              value={pricePerKg}
              onChangeText={setPricePerKg}
            />
          </View>
        </View>

        <Text style={styles.label}>Location / port</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Cubay, Sibalom"
          placeholderTextColor="#6b7280"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Notes for fishermen</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Quality, size, delivery time, etc."
          placeholderTextColor="#6b7280"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <Text style={styles.label}>Reference image (optional)</Text>
        {image ? (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: image.uri }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>Tap to add photo of the fish you want</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, saving && { opacity: 0.7 }]}
          onPress={onSubmit}
          disabled={saving}
        >
          <Text style={styles.buttonText}>{saving ? 'Posting…' : 'Post request'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 16 },
  title: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 16,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },
  imagePicker: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#9ca3af',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    marginTop: 4,
    backgroundColor: '#0E8A8B',
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
