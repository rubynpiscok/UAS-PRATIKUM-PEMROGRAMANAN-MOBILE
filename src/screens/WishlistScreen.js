import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, SPACING } from '../constants/theme';

export default function WishlistScreen({ navigation }) {
  const { wishlist } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Text style={styles.header}>Wishlist Saya</Text>

      {wishlist.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Belum ada barang tersimpan</Text>
          <Text style={styles.emptySubtitle}>
            Ketuk ikon hati pada produk di halaman Katalog untuk menyimpannya di sini.
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('Detail', { product: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  header: {
    fontSize: FONT.h1,
    fontWeight: '800',
    color: COLORS.ink,
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  listContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: -60,
  },
  emptyIcon: {
    fontSize: 48,
    color: COLORS.line,
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.ink,
  },
  emptySubtitle: {
    marginTop: SPACING.xs,
    fontSize: FONT.caption,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
