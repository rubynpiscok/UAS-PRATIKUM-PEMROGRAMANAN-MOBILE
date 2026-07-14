import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

// Komponen reusable #1: dipakai ulang di LoginScreen untuk Nama, Email,
// dan Password, serta di CatalogScreen untuk kolom pencarian.
export default function CustomInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {icon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT.caption,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.xs + 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    gap: SPACING.sm,
  },
  inputWrapperFocused: {
    borderColor: COLORS.moss,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: FONT.body,
    color: COLORS.ink,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT.micro,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
});
