import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT, RADIUS, SPACING } from '../constants/theme';

export default function CustomButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'outline-secondary'
  loading = false,
  disabled = false,
}) {
  const isOutline = variant === 'outline' || variant === 'outline-secondary';
  const isSecondary = variant === 'secondary' || variant === 'outline-secondary';

  let backgroundColor = COLORS.moss;
  if (isSecondary) backgroundColor = COLORS.amber;
  if (isOutline) backgroundColor = 'transparent';

  let borderColor = 'transparent';
  if (isOutline) {
    borderColor = isSecondary ? COLORS.amber : COLORS.moss;
  }

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor, borderColor, borderWidth: isOutline ? 1.5 : 0 },
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? (isSecondary ? COLORS.amber : COLORS.moss) : COLORS.white} />
      ) : (
        <Text style={[styles.text, isOutline ? (isSecondary ? styles.textOutlineSecondary : styles.textOutline) : styles.textPrimary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 50,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: FONT.body,
    fontWeight: '700',
  },
  textPrimary: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.moss,
  },
  textOutlineSecondary: {
    color: COLORS.amber,
  },
});
