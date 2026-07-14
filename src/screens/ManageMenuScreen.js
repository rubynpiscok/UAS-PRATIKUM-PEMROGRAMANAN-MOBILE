import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

const DEFAULT_ITEM_IMAGE = require('../../assets/icon.png');

const resolveImageSource = (source) => {
  if (typeof source === 'number') return source;
  if (source) return { uri: source };
  return DEFAULT_ITEM_IMAGE;
};

export default function ManageMenuScreen() {
  const { sellerMenu, addMenuItem, updateMenuItem, deleteMenuItem } = useAuth();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Menu Kantin');
  const [description, setDescription] = useState('');
  
  const categories = ['Menu Kantin', 'Booking Meja', 'Fotokopi'];

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setPrice('');
    setStock('');
    setCategory('Menu Kantin');
    setDescription('');
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setPrice(item.price.toString());
    setStock(item.stock.toString());
    setCategory(item.mappedCategory);
    setDescription(item.description || '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title.trim() || !price || !stock) {
      alert('Nama, Harga, dan Stok wajib diisi!');
      return;
    }

    const itemData = {
      title,
      price: parseInt(price) || 0,
      stock: parseInt(stock) || 0,
      mappedCategory: category,
      description,
      // Gambar default berdasarkan kategori untuk kemudahan simulasi
      thumbnail: DEFAULT_ITEM_IMAGE,
    };

    if (editingId) {
      updateMenuItem(editingId, itemData);
    } else {
      addMenuItem(itemData);
    }
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={resolveImageSource(item.thumbnail)} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.itemCategory}>{item.mappedCategory}</Text>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
        <Text style={[styles.itemStock, item.stock === 0 && { color: COLORS.error }]}>
          Stok: {item.stock}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
          <Text style={styles.btnText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteMenuItem(item.id)}>
          <Text style={styles.btnText}>🗑️ Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manajemen Stok & Menu</Text>
        <CustomButton title="+ Tambah Item" onPress={openAddModal} />
      </View>

      <FlatList
        data={sellerMenu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada menu yang ditambahkan.</Text>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalWrap}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Item' : 'Tambah Item Baru'}</Text>
              
              <CustomInput label="Nama Item / Layanan" value={title} onChangeText={setTitle} placeholder="Contoh: Nasi Goreng Spesial" />
              
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: SPACING.sm }}>
                  <CustomInput label="Harga (Rp)" value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="15000" />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomInput label="Stok Tersedia" value={stock} onChangeText={setStock} keyboardType="number-pad" placeholder="10" />
                </View>
              </View>

              <Text style={styles.label}>Kategori</Text>
              <View style={styles.catRow}>
                {categories.map(c => (
                  <TouchableOpacity 
                    key={c} 
                    style={[styles.catBtn, category === c && styles.catBtnActive]}
                    onPress={() => setCategory(c)}
                  >
                    <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomInput label="Deskripsi (Opsional)" value={description} onChangeText={setDescription} placeholder="Penjelasan menu atau layanan..." />

              <View style={styles.modalActions}>
                <View style={{ flex: 1, marginRight: SPACING.sm }}>
                  <CustomButton title="Batal" variant="outline" onPress={() => setModalVisible(false)} />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomButton title="Simpan" onPress={handleSave} />
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  header: { padding: SPACING.md, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  headerTitle: { fontSize: FONT.h2, fontWeight: '800', color: COLORS.ink, marginBottom: SPACING.sm },
  list: { padding: SPACING.md, paddingBottom: SPACING.xl },
  emptyText: { textAlign: 'center', marginTop: SPACING.xl, color: COLORS.muted },
  card: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.line },
  image: { width: 80, height: 80, borderRadius: RADIUS.sm, backgroundColor: COLORS.mossLight, marginRight: SPACING.sm },
  cardInfo: { flex: 1, justifyContent: 'center' },
  itemCategory: { fontSize: 10, color: COLORS.moss, fontWeight: '700', textTransform: 'uppercase' },
  itemTitle: { fontSize: FONT.body, fontWeight: '700', color: COLORS.ink },
  itemPrice: { fontSize: FONT.caption, color: COLORS.amber, fontWeight: '700', marginTop: 2 },
  itemStock: { fontSize: FONT.caption, color: COLORS.muted, marginTop: 2 },
  cardActions: { justifyContent: 'space-between' },
  editBtn: { backgroundColor: COLORS.mossLight, padding: SPACING.xs, borderRadius: RADIUS.sm, alignItems: 'center' },
  deleteBtn: { backgroundColor: COLORS.errorLight, padding: SPACING.xs, borderRadius: RADIUS.sm, alignItems: 'center' },
  btnText: { fontSize: 10, fontWeight: '700' },
  modalWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: COLORS.card, borderTopLeftRadius: RADIUS.lg, borderTopRightRadius: RADIUS.lg, padding: SPACING.lg, maxHeight: '80%' },
  modalTitle: { fontSize: FONT.h2, fontWeight: '800', color: COLORS.ink, marginBottom: SPACING.md },
  row: { flexDirection: 'row' },
  label: { fontSize: FONT.caption, fontWeight: '700', color: COLORS.ink, marginBottom: 4 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  catBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.line },
  catBtnActive: { backgroundColor: COLORS.moss, borderColor: COLORS.moss },
  catText: { fontSize: FONT.caption, color: COLORS.muted },
  catTextActive: { color: COLORS.white, fontWeight: '700' },
  modalActions: { flexDirection: 'row', marginTop: SPACING.md },
});
