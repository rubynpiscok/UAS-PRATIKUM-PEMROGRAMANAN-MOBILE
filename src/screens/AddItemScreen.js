import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const IMAGE_OPTIONS = [
  require('../../assets/canteen/nasi_ayam_goreng.png'),
  require('../../assets/canteen/gorengan_mix.png'),
  require('../../assets/canteen/kopi_susu.png'),
  require('../../assets/canteen/meja_vip.png'),
  require('../../assets/canteen/fotokopi.png'),
  require('../../assets/canteen/es_teh_tawar.png'),
];

const DEFAULT_ITEM_IMAGE = IMAGE_OPTIONS[0];

export default function AddItemScreen({ navigation }) {
  const { addMenuItem } = useAuth();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [category, setCategory] = useState('Menu Kantin');
  const [kantinName, setKantinName] = useState('Kantin Saya');
  const [thumbnail, setThumbnail] = useState(DEFAULT_ITEM_IMAGE);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return alert('Judul harus diisi');
    const item = {
      title: title.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      mappedCategory: category,
      kantinName: kantinName,
      description: description || '',
      thumbnail,
    };
    addMenuItem(item);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Judul</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Nama menu atau produk" />

        <Text style={styles.label}>Harga (IDR)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

        <Text style={styles.label}>Stok</Text>
        <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />

        <Text style={styles.label}>Kategori</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} />

        <Text style={styles.label}>Nama Kantin</Text>
        <TextInput style={styles.input} value={kantinName} onChangeText={setKantinName} />

        <Text style={styles.label}>Deskripsi</Text>
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} multiline />

        <Text style={styles.label}>Pilih gambar menu</Text>
        <View style={styles.row}>
          {IMAGE_OPTIONS.map((src, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                setThumbnail(src);
                setThumbnailUrl('');
              }}
              style={[styles.thumbWrap, thumbnail === src && styles.thumbActive]}
            >
              <Image source={src} style={styles.thumb} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Atau URL gambar</Text>
        <TextInput
          style={styles.input}
          value={thumbnailUrl}
          onChangeText={(value) => {
            setThumbnailUrl(value);
            setThumbnail(value.trim() ? value.trim() : DEFAULT_ITEM_IMAGE);
          }}
          placeholder="https://..."
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveText}>Simpan Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  container: { padding: SPACING.lg },
  label: { fontSize: FONT.caption, color: COLORS.muted, marginBottom: 6, fontWeight: '700' },
  input: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.line, color: COLORS.ink },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  thumbWrap: { width: 80, height: 80, borderRadius: RADIUS.sm, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.line },
  thumb: { width: '100%', height: '100%' },
  thumbActive: { borderColor: COLORS.moss, borderWidth: 2 },
  saveButton: { backgroundColor: COLORS.moss, padding: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center', marginTop: SPACING.sm },
  saveText: { color: COLORS.white, fontWeight: '800' },
});
