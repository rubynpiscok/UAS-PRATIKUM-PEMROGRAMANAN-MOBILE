import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

export default function CatalogScreen({ navigation, route }) {
  const { sellerMenu } = useAuth();
  const initialCategory = route?.params?.initialCategory || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = ['all', 'Menu Kantin', 'Booking Meja', 'Fotokopi'];

  // Gunakan menu lokal dari sellerMenu saja, tanpa fetch konten eksternal.
  const filteredProducts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return sellerMenu.filter((p) => {
      const matchesKeyword = !keyword || p.title.toLowerCase().includes(keyword);
      const matchesCategory = selectedCategory === 'all' || p.mappedCategory === selectedCategory;
      return matchesKeyword && matchesCategory;
    });
  }, [sellerMenu, searchQuery, selectedCategory]);

  const renderBody = () => {
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.errorIcon}>🔍</Text>
          <Text style={styles.centerText}>Layanan tidak ditemukan</Text>
          <Text style={styles.centerSubtext}>Coba kata kunci atau kategori lain.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ServiceCard
            product={item}
            onPress={() => navigation.navigate('Detail', { product: item })}
          />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔎</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari menu, layanan, atau meja..."
          placeholderTextColor={COLORS.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.addButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat === 'all' ? 'Semua' : cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.body}>{renderBody()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.line,
    gap: SPACING.sm,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: FONT.body,
    color: COLORS.ink,
  },
  categoryScroll: { marginTop: SPACING.sm + 4, flexGrow: 0 },
  categoryContent: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.line,
    marginRight: SPACING.sm,
  },
  chipActive: {
    backgroundColor: COLORS.moss,
    borderColor: COLORS.moss,
  },
  chipText: {
    fontSize: FONT.micro,
    fontWeight: '600',
    color: COLORS.muted,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: COLORS.white,
  },
  body: { flex: 1 },
  listContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
  },
  errorIcon: { fontSize: 36, marginBottom: SPACING.sm },
  centerText: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
  },
  centerSubtext: {
    marginTop: SPACING.xs,
    fontSize: FONT.caption,
    color: COLORS.muted,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.moss,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
  },
  retryText: { color: COLORS.white, fontWeight: '700', fontSize: FONT.caption },
  addButton: {
    marginLeft: 8,
    backgroundColor: COLORS.moss,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  addButtonText: { color: COLORS.white, fontWeight: '800' },
});
