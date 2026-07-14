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
import { COLORS, FONT, SPACING } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};

    if (!name.trim()) {
      next.name = 'Nama tidak boleh kosong';
    }

    if (!email.trim()) {
      next.email = 'Email tidak boleh kosong';
    } else if (!email.includes('@') || !email.includes('.')) {
      next.email = 'Format email tidak valid';
    }

    if (!phone.trim()) {
      next.phone = 'Nomor HP tidak boleh kosong';
    }

    if (!password) {
      next.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      next.password = 'Password minimal 6 karakter';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    setSubmitting(true);
    // Simulasi proses pendaftaran
    setTimeout(() => {
      setSubmitting(false);
      // Kembali ke halaman login setelah berhasil daftar (simulasi)
      navigation.navigate('Login');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>
              Kampus<Text style={styles.logoAccent}>Market</Text>
            </Text>
            <Text style={styles.subtitle}>Daftar Akun Baru</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Nama Lengkap"
              placeholder="Masukkan nama kamu"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <CustomInput
              label="Email"
              placeholder="nama@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
            <CustomInput
              label="Nomor HP"
              placeholder="08123456789"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <CustomInput
              label="Password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <View style={styles.buttonSpacing}>
              <CustomButton title="Daftar Sekarang" onPress={handleRegister} loading={submitting} />
            </View>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.paper },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: FONT.display,
    fontWeight: '800',
    color: COLORS.moss,
  },
  logoAccent: {
    color: COLORS.amber,
  },
  subtitle: {
    marginTop: SPACING.xs + 2,
    fontSize: FONT.caption,
    color: COLORS.muted,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  buttonSpacing: {
    marginTop: SPACING.md,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    color: COLORS.muted,
    fontSize: FONT.body,
  },
  loginLink: {
    color: COLORS.amber,
    fontSize: FONT.body,
    fontWeight: '700',
  },
});
