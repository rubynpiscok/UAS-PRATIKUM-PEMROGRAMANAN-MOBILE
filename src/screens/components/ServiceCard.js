import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - SPACING.md * 2 - 12) / 2;
const DEFAULT_ITEM_IMAGE = require('../../assets/icon.png');

// Komponen Reusable #3 — ServiceCard (sebelumnya ProductCard).
// Mendukung efek redup (opacity 0.4) dan tombol disabled jika stok habis (Prompt 2).
export default function ServiceCard({ product, onPress }) {
  const { isWishlisted, toggleWishlist } = useAuth();
  const saved = isWishlisted(product.id);
  const imageSource = typeof product.thumbnail === 'number'
    ? product.thumbnail
    : product.thumbnail
      ? { uri: product.thumbnail }
      : DEFAULT_ITEM_IMAGE;

  // Stock logic (Aspek Prompt 2):
  //   - stock > 0  → "Masih Ready" (hijau), kartu normal, tombol aktif
  //   - stock === 0 → "Habis" (merah), kartu redup opacity 0.4, tombol disabled
  const isOutOfStock = product.stock === 0;

  let statusText = '';
  let statusColor = COLORS.moss;
  let statusBg = COLORS.mossLight;
  
  if (product.mappedCategory === 'Menu Kantin') {
    statusText = isOutOfStock ? 'Habis' : 'Masih Ready';
    statusColor = isOutOfStock ? COLORS.error : COLORS.moss;
    statusBg = isOutOfStock ? COLORS.errorLight : COLORS.mossLight;
  } else if (product.mappedCategory === 'Booking Meja') {
    statusText = isOutOfStock ? 'Habis' : 'Tersedia (Booking)';
    statusColor = isOutOfStock ? COLORS.error : '#7C3AED';
    statusBg = isOutOfStock ? COLORS.errorLight : '#EDE9FE';
  } else {
    statusText = isOutOfStock ? 'Habis' : 'Di Fakultas';
    statusColor = isOutOfStock ? COLORS.error : COLORS.amber;
    statusBg = isOutOfStock ? COLORS.errorLight : COLORS.amberLight;
  }

  return (
    // Jika stok habis, buat seluruh kartu redup dengan opacity 0.4
    <View style={[styles.wrapper, isOutOfStock && styles.wrapperDim]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.85}
        disabled={isOutOfStock}     // Tidak bisa di-klik jika stok habis
      >
        <View>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />

          {/* Badge status (Masih Ready / Habis) */}
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => !isOutOfStock && toggleWishlist(product)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={isOutOfStock}
          >
            <Text style={[styles.heartIcon, saved && styles.heartIconActive]}>
              {saved ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.category} numberOfLines={1}>
            {product.mappedCategory || product.category}
          </Text>
          <Text style={styles.title} numberOfLines={2}>{product.title}</Text>

          <View style={styles.footerRow}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>Rp {product.price?.toLocaleString('id-ID')}</Text>
            </View>
            {isOutOfStock ? (
              <Text style={styles.outOfStockLabel}>Stok Habis</Text>
            ) : (
              <Text style={styles.ratingText}>★ {product.rating?.toFixed(1)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
  },
  wrapperDim: {
    opacity: 0.4,  // Efek redup jika stok habis (Prompt 2)
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: COLORS.mossLight,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(28,27,23,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: { fontSize: 16, color: COLORS.white, lineHeight: 18 },
  heartIconActive: { color: '#FF6B6B' },
  body: { padding: SPACING.sm + 2 },
  category: {
    fontSize: FONT.micro,
    fontWeight: '700',
    color: COLORS.moss,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.ink,
    minHeight: 34,
    marginBottom: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceTag: {
    backgroundColor: COLORS.amberLight,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  priceText: {
    fontSize: FONT.caption,
    fontWeight: '800',
    color: COLORS.amber,
  },
  ratingText: {
    fontSize: FONT.micro,
    fontWeight: '600',
    color: COLORS.muted,
  },
  outOfStockLabel: {
    fontSize: FONT.micro,
    fontWeight: '700',
    color: COLORS.error,
  },
});
