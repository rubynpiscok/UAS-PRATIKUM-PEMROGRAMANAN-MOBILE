import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
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
import { COLORS, FONT, SPACING } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [npm, setNpm] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validasi (Aspek 5): Nama, NPM, NoHP wajib isi, email harus '@', password min 6 karakter.
  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Nama tidak boleh kosong';
    if (!npm.trim()) {
      next.npm = 'NPM tidak boleh kosong';
    } else if (!/^\d{6,12}$/.test(npm.trim())) {
      next.npm = 'NPM harus berupa angka 6-12 digit';
    }
    if (!phone.trim()) next.phone = 'Nomor HP tidak boleh kosong';
    if (!email.trim()) {
      next.email = 'Email tidak boleh kosong';
    } else if (!email.includes('@') || !email.includes('.')) {
      next.email = 'Format email tidak valid';
    }
    if (!password) {
      next.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      next.password = 'Password minimal 6 karakter';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      login({ name: name.trim(), email: email.trim(), npm: npm.trim(), phone: phone.trim() });
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>Kampus<Text style={styles.logoAccent}>Market</Text></Text>
            <Text style={styles.subtitle}>Hub Kantin, Fotokopi & Booking Meja</Text>
          </View>

          <View style={styles.form}>
            <CustomInput label="Nama Lengkap" placeholder="Masukkan nama lengkap" value={name} onChangeText={setName} error={errors.name} />
            <CustomInput label="NPM (Nomor Pokok Mahasiswa)" placeholder="Contoh: 193310001" value={npm} onChangeText={setNpm} keyboardType="number-pad" error={errors.npm} />
            <CustomInput label="Nomor WhatsApp/HP Aktif" placeholder="Contoh: 08123456789" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
            <CustomInput label="Email Mahasiswa" placeholder="nama@student.ac.id" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
            <CustomInput label="Password" placeholder="Minimal 6 karakter" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />

            <View style={styles.buttonSpacing}>
              <CustomButton title="Masuk" onPress={handleLogin} loading={submitting} />
            </View>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Daftar di sini</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footerNote}>
            Nama & NPM akan otomatis terlampir ke setiap pesanan agar penjual mengenali Anda.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  logo: { fontSize: FONT.display, fontWeight: '800', color: COLORS.moss },
  logoAccent: { color: COLORS.amber },
  subtitle: { marginTop: SPACING.xs + 2, fontSize: FONT.caption, color: COLORS.muted, textAlign: 'center' },
  form: { width: '100%' },
  buttonSpacing: { marginTop: SPACING.xs },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.lg },
  registerText: { color: COLORS.muted, fontSize: FONT.body },
  registerLink: { color: COLORS.amber, fontSize: FONT.body, fontWeight: '700' },
  footerNote: { marginTop: SPACING.lg, fontSize: 11, color: COLORS.placeholder, textAlign: 'center', paddingHorizontal: SPACING.md },
});
