import React, { useState } from 'react';
import {
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

export default function ProfileScreen() {
  const { user, updateProfile, orders, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [npm, setNpm] = useState(user?.npm || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || '?';

  const handleSave = () => {
    updateProfile({ name: name.trim(), npm: npm.trim(), phone: phone.trim(), email: email.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setNpm(user?.npm || '');
    setPhone(user?.phone || '');
    setEmail(user?.email || '');
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Mahasiswa'}</Text>
          <View style={styles.npmBadge}>
            <Text style={styles.npmBadgeText}>NPM: {user?.npm || '-'}</Text>
          </View>
        </View>

        {/* Form Identitas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Identitas Mahasiswa</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editLink}>✏️ Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <>
              <CustomInput label="Nama Lengkap" value={name} onChangeText={setName} placeholder="Nama Lengkap" />
              <CustomInput label="NPM" value={npm} onChangeText={setNpm} placeholder="Nomor Pokok Mahasiswa" keyboardType="number-pad" />
              <CustomInput label="Nomor WhatsApp/HP" value={phone} onChangeText={setPhone} placeholder="08123456789" keyboardType="phone-pad" />
              <CustomInput label="Email" value={email} onChangeText={setEmail} placeholder="nama@student.ac.id" keyboardType="email-address" />
              <View style={styles.editActions}>
                <View style={{ flex: 1 }}>
                  <CustomButton title="Simpan" onPress={handleSave} />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomButton title="Batal" onPress={handleCancel} variant="outline" />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.infoCard}>
              {[
                { label: 'Nama Lengkap', value: user?.name },
                { label: 'NPM', value: user?.npm },
                { label: 'No HP / WhatsApp', value: user?.phone },
                { label: 'Email', value: user?.email },
              ].map((row, i, arr) => (
                <View key={row.label}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{row.label}</Text>
                    <Text style={styles.infoValue}>{row.value || '-'}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={styles.infoDivider} />}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Riwayat Pesanan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Pesanan ({orders.length})</Text>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada pesanan.</Text>
          ) : (
            orders.slice(0, 5).map((o) => (
              <View key={o.id} style={styles.orderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderTitle} numberOfLines={1}>{o.itemName}</Text>
                  <Text style={styles.orderSub}>Total: Rp {o.totalPrice?.toLocaleString('id-ID')}</Text>
                </View>
                <View style={[styles.statusBadge, STATUS_COLORS[o.status]]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[o.status]}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Logout */}
        <View style={styles.logoutWrap}>
          <CustomButton title="Keluar" onPress={logout} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const STATUS_LABELS = {
  pending: 'Menunggu',
  processing: 'Diproses',
  rejected: 'Ditolak',
  pickup: 'Ambil Sendiri',
};

const STATUS_COLORS = {
  pending: { backgroundColor: '#FEF3C7' },
  processing: { backgroundColor: COLORS.mossLight },
  rejected: { backgroundColor: COLORS.errorLight },
  pickup: { backgroundColor: COLORS.amberLight },
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  scrollContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  avatarWrap: { alignItems: 'center', paddingVertical: SPACING.lg },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: COLORS.moss, alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: COLORS.white },
  name: { fontSize: FONT.h1, fontWeight: '800', color: COLORS.ink },
  npmBadge: {
    marginTop: SPACING.xs,
    backgroundColor: COLORS.mossLight,
    paddingHorizontal: SPACING.sm + 2, paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  npmBadgeText: { fontSize: FONT.caption, color: COLORS.moss, fontWeight: '700' },
  section: { marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONT.h2, fontWeight: '700', color: COLORS.ink },
  editLink: { fontSize: FONT.caption, color: COLORS.amber, fontWeight: '700' },
  infoCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.line, padding: SPACING.md,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  infoDivider: { height: 1, backgroundColor: COLORS.line },
  infoLabel: { fontSize: FONT.caption, color: COLORS.muted },
  infoValue: { fontSize: FONT.caption, color: COLORS.ink, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  editActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  orderRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.line, padding: SPACING.sm + 2,
    marginBottom: SPACING.sm, gap: SPACING.sm,
  },
  orderTitle: { fontSize: FONT.body, fontWeight: '600', color: COLORS.ink },
  orderSub: { fontSize: FONT.caption, color: COLORS.muted, marginTop: 2 },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.pill },
  statusText: { fontSize: FONT.micro, fontWeight: '700', color: COLORS.ink },
  emptyText: { fontSize: FONT.caption, color: COLORS.muted, fontStyle: 'italic' },
  logoutWrap: { marginTop: SPACING.md },
});
