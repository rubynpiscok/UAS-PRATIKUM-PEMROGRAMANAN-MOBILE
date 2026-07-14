import React, { useState } from 'react';
import {
  Image,
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

const BIAYA_ANTAR = 3000;   // Rp 3.000
const BIAYA_BOOKING = 2000; // Rp 2.000

// Metode layanan: 'pickup' | 'delivery' | 'booking'
const METHODS = [
  { key: 'pickup',   label: 'Ambil Sendiri di Kantin', icon: '🏃', fee: 0 },
  { key: 'delivery', label: 'Antar ke Kelas/Fakultas',  icon: '🛵', fee: BIAYA_ANTAR },
  { key: 'booking',  label: 'Booking Meja Kantin',      icon: '🪑', fee: BIAYA_BOOKING },
];

export default function DetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { user, placeOrder } = useAuth();

  const gallery = product.images?.length ? product.images : [product.thumbnail];
  const isBookingProduct = product.mappedCategory === 'Booking Meja';

  // Default method sesuai kategori produk
  const defaultMethod = isBookingProduct ? 'booking' : 'pickup';
  const [method, setMethod] = useState(defaultMethod);
  const [location, setLocation] = useState('');   // Untuk delivery
  const [tableNo, setTableNo] = useState('');     // Untuk booking
  const [tableTime, setTableTime] = useState(''); // Untuk booking
  const [toastMsg, setToastMsg] = useState('');

  // Harga produk dalam rupiah
  const basePrice = Math.round(product.price * 10000);
  const selectedFee = METHODS.find(m => m.key === method)?.fee ?? 0;
  const totalPrice = basePrice + selectedFee; // Kalkulasi real-time

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOrder = () => {
    if (method === 'delivery' && !location.trim()) {
      showToast('⚠️ Masukkan lokasi tujuan pengiriman terlebih dahulu.');
      return;
    }
    if (method === 'booking' && (!tableNo.trim() || !tableTime.trim())) {
      showToast('⚠️ Isi nomor meja dan jam booking terlebih dahulu.');
      return;
    }

    const order = {
      itemId: product.id,
      itemName: product.title,
      category: product.mappedCategory,
      basePrice,
      deliveryFee: selectedFee,
      totalPrice,
      method,
      location: method === 'delivery' ? location : '',
      tableNo: method === 'booking' ? tableNo : '',
      tableTime: method === 'booking' ? tableTime : '',
      thumbnail: product.thumbnail,
    };

    placeOrder(order);
    showToast(`✅ Pesanan "${product.title}" berhasil dikirim ke penjual!`);
    setTimeout(() => navigation.goBack(), 1800);
  };

  const renderMethodOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Pilihan Layanan</Text>
      {METHODS.map((m) => {
        const active = method === m.key;
        return (
          <TouchableOpacity
            key={m.key}
            style={[styles.methodBtn, active && styles.methodBtnActive]}
            onPress={() => setMethod(m.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.methodIcon}>{m.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>{m.label}</Text>
              <Text style={styles.methodFee}>
                {m.fee === 0 ? 'Gratis' : `+ Rp ${m.fee.toLocaleString('id-ID')}`}
              </Text>
            </View>
            <View style={[styles.radio, active && styles.radioActive]}>
              {active && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Input tambahan untuk delivery */}
      {method === 'delivery' && (
        <View style={styles.extraInput}>
          <CustomInput
            label="Lokasi Ruang/Gedung Tujuan"
            placeholder="Contoh: Gedung A, Ruang 302 — Teknik"
            value={location}
            onChangeText={setLocation}
          />
        </View>
      )}

      {/* Input tambahan untuk booking */}
      {method === 'booking' && (
        <View style={styles.extraInput}>
          <CustomInput
            label="Pilih Nomor Meja"
            placeholder="Contoh: Meja 04 / Meja VIP"
            value={tableNo}
            onChangeText={setTableNo}
          />
          <CustomInput
            label="Jam Booking/Reservasi"
            placeholder="Contoh: 12:00 - 14:00"
            value={tableTime}
            onChangeText={setTableTime}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Gambar besar */}
        <Image source={resolveImageSource(gallery[0])} style={styles.heroImage} resizeMode="cover" />

        {gallery.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.thumbRow} contentContainerStyle={styles.thumbContent}>
            {gallery.map((uri, i) => (
              <Image key={i} source={resolveImageSource(uri)} style={styles.thumb} resizeMode="cover" />
            ))}
          </ScrollView>
        )}

        <View style={styles.content}>
          {/* Identitas Produk */}
          <Text style={styles.category}>{product.mappedCategory || product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {product.rating?.toFixed(1) ?? '-'}</Text>
            </View>
            <Text style={styles.stockText}>
              {product.stock > 0 ? `Stok: ${product.stock}` : '❌ Stok Habis'}
            </Text>
          </View>

          {/* Harga dasar */}
          <Text style={styles.basePrice}>Rp {basePrice.toLocaleString('id-ID')}</Text>

          <View style={styles.divider} />

          {/* Pilihan metode layanan */}
          {renderMethodOptions()}

          <View style={styles.divider} />

          {/* Kalkulasi Total Real-time */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Rincian Biaya</Text>
            <View style={styles.calcCard}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Harga Item</Text>
                <Text style={styles.calcValue}>Rp {basePrice.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>
                  {method === 'delivery' ? 'Biaya Antar' : method === 'booking' ? 'Biaya Reservasi' : 'Biaya Tambahan'}
                </Text>
                <Text style={[styles.calcValue, selectedFee > 0 && { color: COLORS.amber }]}>
                  {selectedFee === 0 ? 'Rp 0 (Gratis)' : `+ Rp ${selectedFee.toLocaleString('id-ID')}`}
                </Text>
              </View>
              <View style={styles.totalDivider} />
              <View style={styles.calcRow}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Identitas pengirim */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Identitas Pemesan</Text>
            <View style={styles.buyerCard}>
              <Text style={styles.buyerName}>👤 {user?.name || '-'}</Text>
              <Text style={styles.buyerDetail}>NPM: {user?.npm || '-'}</Text>
              <Text style={styles.buyerDetail}>HP: {user?.phone || '-'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Deskripsi */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Deskripsi</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Toast */}
      {!!toastMsg && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}

      {/* Sticky Bottom Action Bar */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total Bayar</Text>
          <Text style={styles.footerTotalValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
        </View>
        <View style={styles.footerBtn}>
          <CustomButton
            title="Kirim Pesanan ke Penjual"
            onPress={handleOrder}
            disabled={product.stock === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  scrollContent: { paddingBottom: SPACING.md },
  heroImage: { width: '100%', height: 300, backgroundColor: COLORS.mossLight },
  thumbRow: { marginTop: SPACING.sm, flexGrow: 0 },
  thumbContent: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  thumb: {
    width: 60, height: 60, borderRadius: RADIUS.sm,
    marginRight: SPACING.sm, backgroundColor: COLORS.mossLight,
    borderWidth: 1, borderColor: COLORS.line,
  },
  content: { padding: SPACING.md },
  category: {
    fontSize: FONT.caption, fontWeight: '700', color: COLORS.moss,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.xs,
  },
  title: { fontSize: FONT.h1, fontWeight: '800', color: COLORS.ink, marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  ratingBadge: {
    backgroundColor: COLORS.amberLight, paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4, borderRadius: RADIUS.pill,
  },
  ratingText: { color: COLORS.amber, fontWeight: '700', fontSize: FONT.caption },
  stockText: { fontSize: FONT.caption, color: COLORS.muted },
  basePrice: { fontSize: 26, fontWeight: '800', color: COLORS.moss, marginBottom: SPACING.md },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: SPACING.md },
  section: { marginBottom: SPACING.xs },
  sectionLabel: { fontSize: FONT.h2, fontWeight: '700', color: COLORS.ink, marginBottom: SPACING.sm },
  methodBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.line,
    borderRadius: RADIUS.md, padding: SPACING.sm + 2,
    marginBottom: SPACING.sm, gap: SPACING.sm,
    backgroundColor: COLORS.card,
  },
  methodBtnActive: { borderColor: COLORS.moss, backgroundColor: COLORS.mossLight },
  methodIcon: { fontSize: 22 },
  methodLabel: { fontSize: FONT.body, fontWeight: '600', color: COLORS.ink },
  methodLabelActive: { color: COLORS.moss },
  methodFee: { fontSize: FONT.caption, color: COLORS.muted, marginTop: 2 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.line,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.moss },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.moss },
  extraInput: { marginTop: SPACING.xs },
  calcCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.line, padding: SPACING.md,
  },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  calcLabel: { fontSize: FONT.caption, color: COLORS.muted },
  calcValue: { fontSize: FONT.caption, fontWeight: '600', color: COLORS.ink },
  totalDivider: { height: 1, backgroundColor: COLORS.line, marginVertical: SPACING.xs },
  totalLabel: { fontSize: FONT.body, fontWeight: '800', color: COLORS.ink },
  totalValue: { fontSize: FONT.body, fontWeight: '800', color: COLORS.moss },
  buyerCard: {
    backgroundColor: COLORS.mossLight, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.moss, padding: SPACING.md, gap: 4,
  },
  buyerName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.moss },
  buyerDetail: { fontSize: FONT.caption, color: COLORS.ink },
  description: { fontSize: FONT.body, lineHeight: 22, color: COLORS.muted },
  toast: {
    position: 'absolute', left: SPACING.md, right: SPACING.md, bottom: 90,
    backgroundColor: COLORS.ink, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2,
  },
  toastText: { color: COLORS.white, fontSize: FONT.caption, fontWeight: '600' },
  footer: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.line,
    backgroundColor: COLORS.card, gap: SPACING.sm,
  },
  footerTotal: { flex: 0.4 },
  footerTotalLabel: { fontSize: FONT.micro, color: COLORS.muted, fontWeight: '600' },
  footerTotalValue: { fontSize: FONT.body, fontWeight: '800', color: COLORS.moss },
  footerBtn: { flex: 0.6 },
});
