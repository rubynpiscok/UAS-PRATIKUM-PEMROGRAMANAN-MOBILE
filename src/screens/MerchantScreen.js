import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

const DEFAULT_ITEM_IMAGE = require('../../assets/icon.png');
const resolveImageSource = (source) => {
  if (typeof source === 'number') return source;
  if (source) return { uri: source };
  return DEFAULT_ITEM_IMAGE;
};

const STATUS_CONFIG = {
  pending:    { label: '🕐 Menunggu',        bg: '#FEF3C7', color: '#D97706' },
  processing: { label: '🍳 Sedang Dimasak',  bg: COLORS.mossLight, color: COLORS.moss },
  rejected:   { label: '❌ Ditolak',         bg: COLORS.errorLight, color: COLORS.error },
  pickup:     { label: '🏃 Minta Dijemput',  bg: COLORS.amberLight, color: COLORS.amber },
};

export default function MerchantScreen({ navigation }) {
  const { orders, updateOrderStatus } = useAuth();

  const renderHeader = () => (
    <View style={styles.headerBar}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>👩‍🍳 Panel Ibu Kantin</Text>
        <Text style={styles.headerSub}>{orders.length} pesanan masuk</Text>
      </View>
      <TouchableOpacity 
        style={styles.manageMenuBtn} 
        onPress={() => navigation.navigate('ManageMenu')}
      >
        <Text style={styles.manageMenuText}>Kelola Stok</Text>
      </TouchableOpacity>
    </View>
  );

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {renderHeader()}
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>Belum Ada Pesanan Masuk</Text>
          <Text style={styles.emptySub}>Pesanan dari mahasiswa akan muncul di sini setelah mereka menekan "Kirim Pesanan ke Penjual".</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {orders.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          return (
            <View key={order.id} style={styles.orderCard}>
              {/* Identitas Pembeli — tampil jelas di atas */}
              <View style={styles.buyerBanner}>
                <View style={styles.buyerAvatar}>
                  <Text style={styles.buyerAvatarText}>
                    {order.buyer?.name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.buyerName}>{order.buyer?.name || '-'}</Text>
                  <Text style={styles.buyerNpm}>NPM: {order.buyer?.npm || '-'}</Text>
                  <Text style={styles.buyerPhone}>HP: {order.buyer?.phone || '-'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>

              {/* Detail Item */}
              <View style={styles.itemRow}>
                {order.thumbnail ? (
                  <Image source={resolveImageSource(order.thumbnail)} style={styles.itemThumb} resizeMode="cover" />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={2}>{order.itemName}</Text>
                  <Text style={styles.itemCategory}>{order.category}</Text>
                  <Text style={styles.itemMethod}>
                    {order.method === 'delivery' ? `🛵 Antar → ${order.location || '(belum diisi)'}` :
                     order.method === 'booking'  ? `🪑 Booking Meja ${order.tableNo} @ ${order.tableTime}` :
                     '🏃 Ambil Sendiri'}
                  </Text>
                </View>
              </View>

              {/* Rincian Biaya */}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Harga Item</Text>
                <Text style={styles.priceValue}>Rp {order.basePrice?.toLocaleString('id-ID')}</Text>
              </View>
              {order.deliveryFee > 0 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Biaya Tambahan</Text>
                  <Text style={[styles.priceValue, { color: COLORS.amber }]}>
                    + Rp {order.deliveryFee?.toLocaleString('id-ID')}
                  </Text>
                </View>
              )}
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>Rp {order.totalPrice?.toLocaleString('id-ID')}</Text>
              </View>

              {/* 3 Tombol Aksi — hanya tampil jika pesanan masih pending */}
              {order.status === 'pending' && (
                <View style={styles.actions}>
                  {/* Tombol 1: Terima & Proses */}
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => updateOrderStatus(order.id, 'processing')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.actionBtnText, styles.acceptBtnText]}>✅ Terima & Proses</Text>
                  </TouchableOpacity>

                  {/* Tombol 2: Tolak Pesanan */}
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => updateOrderStatus(order.id, 'rejected')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.actionBtnText, { color: COLORS.error }]}>❌ Tolak Pesanan</Text>
                  </TouchableOpacity>

                  {/* Tombol 3: Minta Dijemput — hanya tampil untuk mode delivery */}
                  {order.method === 'delivery' && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.pickupBtn]}
                      onPress={() => updateOrderStatus(order.id, 'pickup')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.actionBtnText, { color: COLORS.amber }]}>
                        🏃 Minta Dijemput Saja
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Pesan Konfirmasi Final */}
              {order.status === 'processing' && (
                <View style={[styles.finalMsg, { backgroundColor: COLORS.mossLight }]}>
                  <Text style={{ color: COLORS.moss, fontWeight: '700', fontSize: FONT.caption }}>
                    🍳 Pesanan sedang dimasak/diproses. Hubungi pembeli jika sudah siap.
                  </Text>
                </View>
              )}
              {order.status === 'rejected' && (
                <View style={[styles.finalMsg, { backgroundColor: COLORS.errorLight }]}>
                  <Text style={{ color: COLORS.error, fontWeight: '700', fontSize: FONT.caption }}>
                    ❌ Pesanan ditolak. Mahasiswa akan mendapat notifikasi.
                  </Text>
                </View>
              )}
              {order.status === 'pickup' && (
                <View style={[styles.finalMsg, { backgroundColor: COLORS.amberLight }]}>
                  <Text style={{ color: COLORS.amber, fontWeight: '700', fontSize: FONT.caption }}>
                    🏃 Biaya antar dibatalkan. Mahasiswa diminta mengambil sendiri ke kantin.
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontSize: FONT.h2, fontWeight: '800', color: COLORS.ink, textAlign: 'center' },
  emptySub: { fontSize: FONT.caption, color: COLORS.muted, textAlign: 'center', marginTop: SPACING.xs, lineHeight: 18 },
  headerBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.moss, paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  headerTitle: { fontSize: FONT.h2, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: FONT.caption, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  manageMenuBtn: { 
    backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.md 
  },
  manageMenuText: { fontSize: FONT.caption, fontWeight: '700', color: COLORS.moss },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.md },
  orderCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden',
  },
  buyerBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.mossLight, padding: SPACING.md, gap: SPACING.sm,
  },
  buyerAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.moss, alignItems: 'center', justifyContent: 'center',
  },
  buyerAvatarText: { color: COLORS.white, fontWeight: '800', fontSize: FONT.body },
  buyerName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.moss },
  buyerNpm: { fontSize: FONT.caption, color: COLORS.ink, marginTop: 2 },
  buyerPhone: { fontSize: FONT.caption, color: COLORS.muted },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: FONT.micro, fontWeight: '700' },
  itemRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm, alignItems: 'flex-start' },
  itemThumb: {
    width: 60, height: 60, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.mossLight,
  },
  itemName: { fontSize: FONT.body, fontWeight: '700', color: COLORS.ink },
  itemCategory: { fontSize: FONT.caption, color: COLORS.moss, marginTop: 2 },
  itemMethod: { fontSize: FONT.caption, color: COLORS.muted, marginTop: 4, lineHeight: 16 },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: 4,
  },
  priceLabel: { fontSize: FONT.caption, color: COLORS.muted },
  priceValue: { fontSize: FONT.caption, fontWeight: '600', color: COLORS.ink },
  totalRow: {
    borderTopWidth: 1, borderTopColor: COLORS.line,
    marginTop: SPACING.xs, paddingTop: SPACING.sm, marginBottom: SPACING.sm,
  },
  totalLabel: { fontSize: FONT.body, fontWeight: '800', color: COLORS.ink },
  totalValue: { fontSize: FONT.body, fontWeight: '800', color: COLORS.moss },
  actions: { padding: SPACING.md, gap: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.line },
  actionBtn: {
    paddingVertical: 12, borderRadius: RADIUS.md,
    alignItems: 'center', borderWidth: 1.5,
  },
  actionBtnText: { fontSize: FONT.body, fontWeight: '700' },
  acceptBtn: { backgroundColor: COLORS.moss, borderColor: COLORS.moss },
  // tombol terima: teks putih agar kontras dengan latar hijau
  acceptBtnText: { color: COLORS.white },
  rejectBtn: { backgroundColor: COLORS.errorLight, borderColor: COLORS.error },
  pickupBtn: { backgroundColor: COLORS.amberLight, borderColor: COLORS.amber },
  finalMsg: { margin: SPACING.md, padding: SPACING.sm + 2, borderRadius: RADIUS.md },
});
