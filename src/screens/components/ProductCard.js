import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
// 2 kolom dengan padding luar 16 dan jarak antar kartu 12 (lihat CatalogScreen)
export const CARD_WIDTH = (width - SPACING.md * 2 - 12) / 2;

// Komponen reusable #3: dipakai berulang di dalam FlatList CatalogScreen.
export default function ProductCard({ product, onPress }) {
  const { isWishlisted, toggleWishlist } = useAuth();
  const saved = isWishlisted(product.id);
  const imageSource = typeof product.thumbnail === 'number'
    ? product.thumbnail
    : { uri: product.thumbnail };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.codBadge}>
          <Text style={styles.codText}>Bisa COD</Text>
        </View>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleWishlist(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>Rp {product.price?.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>★ {product.rating?.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
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
  codBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.amber,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
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
  heartIcon: {
    fontSize: 16,
    color: COLORS.white,
    lineHeight: 18,
  },
  heartIconActive: {
    color: '#FF6B6B',
  },
  body: {
    padding: SPACING.sm + 2,
  },
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONT.micro,
    fontWeight: '600',
    color: COLORS.muted,
  },
});
