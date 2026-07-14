import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

// Dashboard 3 layanan utama kampus.
const SERVICES = [
  {
    key: 'kantin',
    icon: '🍱',
    label: 'Kantin Fakultas',
    desc: 'Menu hari ini dari kantin seluruh fakultas',
    color: COLORS.moss,
    light: COLORS.mossLight,
    category: 'Menu Kantin',
  },
  {
    key: 'booking',
    icon: '🪑',
    label: 'Booking Meja',
    desc: 'Reservasi meja di kantin favorit kamu',
    color: '#7C3AED',
    light: '#EDE9FE',
    category: 'Booking Meja',
  },
  {
    key: 'fotokopi',
    icon: '🖨️',
    label: 'Jasa Fotokopi',
    desc: 'Cetak & fotokopi dengan sistem antar ke kelas',
    color: COLORS.amber,
    light: COLORS.amberLight,
    category: 'Fotokopi',
  },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  const handleServicePress = (category) => {
    // Arahkan ke CatalogScreen dengan filter kategori aktif.
    navigation.navigate('Katalog', { initialCategory: category });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header sambutan */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo, {user?.name?.split(' ')[0] || 'Mahasiswa'} 👋</Text>
            <Text style={styles.npm}>NPM: {user?.npm || '-'}</Text>
          </View>
          <TouchableOpacity style={styles.merchantBtn} onPress={() => navigation.navigate('Merchant')}>
            <Text style={styles.merchantBtnText}>👩‍🍳 Penjual</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Selamat datang di KampusMarket!</Text>
          <Text style={styles.bannerSub}>Pesan makan, reservasi meja, atau cetak dokumen — semua dari genggaman tangan.</Text>
        </View>

        {/* 3 Kartu Layanan */}
        <Text style={styles.sectionTitle}>Pilih Layanan</Text>
        <View style={styles.serviceGrid}>
          {SERVICES.map((svc) => (
            <TouchableOpacity
              key={svc.key}
              style={[styles.serviceCard, { borderColor: svc.color, backgroundColor: svc.light }]}
              activeOpacity={0.8}
              onPress={() => handleServicePress(svc.category)}
            >
              <Text style={styles.serviceIcon}>{svc.icon}</Text>
              <Text style={[styles.serviceLabel, { color: svc.color }]}>{svc.label}</Text>
              <Text style={styles.serviceDesc}>{svc.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Merchant */}
        <TouchableOpacity style={styles.merchantCard} onPress={() => navigation.navigate('Merchant')}>
          <Text style={styles.merchantCardIcon}>👩‍🍳</Text>
          <View style={styles.merchantCardBody}>
            <Text style={styles.merchantCardTitle}>Mode Penjual (Ibu Kantin)</Text>
            <Text style={styles.merchantCardSub}>Kelola dan konfirmasi pesanan masuk dari mahasiswa</Text>
          </View>
          <Text style={styles.merchantArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  greeting: { fontSize: FONT.h2, fontWeight: '800', color: COLORS.ink },
  npm: { fontSize: FONT.caption, color: COLORS.muted, marginTop: 2 },
  merchantBtn: {
    backgroundColor: COLORS.amberLight,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.amber,
  },
  merchantBtnText: { fontSize: FONT.caption, color: COLORS.amber, fontWeight: '700' },
  banner: {
    backgroundColor: COLORS.moss,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 4,
    marginBottom: SPACING.lg,
  },
  bannerTitle: { fontSize: FONT.h2, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  bannerSub: { fontSize: FONT.caption, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },
  sectionTitle: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.sm + 2,
  },
  serviceGrid: { gap: SPACING.sm + 2, marginBottom: SPACING.lg },
  serviceCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md + 4,
  },
  serviceIcon: { fontSize: 32, marginBottom: SPACING.sm },
  serviceLabel: { fontSize: FONT.h2, fontWeight: '800', marginBottom: 4 },
  serviceDesc: { fontSize: FONT.caption, color: COLORS.muted, lineHeight: 18 },
  merchantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: SPACING.md,
    gap: SPACING.sm + 2,
  },
  merchantCardIcon: { fontSize: 28 },
  merchantCardBody: { flex: 1 },
  merchantCardTitle: { fontSize: FONT.body, fontWeight: '700', color: COLORS.ink },
  merchantCardSub: { fontSize: FONT.caption, color: COLORS.muted, marginTop: 2 },
  merchantArrow: { fontSize: 22, color: COLORS.muted },
});
